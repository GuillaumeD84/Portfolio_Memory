var app = {
  // Carte restantes sur le plateau
  remainingCards: 28,
  // Temps maximum en seconde pour gagner une partie
  countdown: 60,
  // Interval permettant la mise à jour de la progressbar
  countdownInterval: '',
  // Tableau contenant les deux dernières cartes retournées
  lastTwoCardsFlippedId: [],
  init: function() {
    // Event sur le bouton permettant de lancer le jeu
    $('#startBtn').on('click', app.startGame);
    app.setUpBoard();
    app.disableCards();
    app.setUpAudio();
    app.initProgressBar();
  },
  // Permet de lancer une partie
  startGame: function() {
    // On désactive le bouton START une fois cliqué
    $('#startBtn').off('click', app.startGame);
    // On démarre la partie dans 3 secondes
    $('#startBtn').val('3');
    setTimeout(function(){ $('#startBtn').val('2'); }, 1000);
    setTimeout(function(){ $('#startBtn').val('1'); }, 2000);
    // Dans 3 secondes on active les cartes, démarre le timer et l'audio
    setTimeout(function(){
      $('#startBtn').val('GO !');
      app.makeCardsClickable();
      app.startCountdown();
      document.getElementById('countdown').play();
    }, 3000);
  },
  // Randomize l'ordre des cartes sur le plateau
  setUpBoard: function() {
    app.shuffleCards(cards);
    var board = $('#board');

    for (var i = 0; i < board.children().length; i++) {
      $(board.children().get(i)).find('.image').css('background', 'url("images/cards.png") 0 ' + cards[i] + ' border-box');
    }
  },
  // Configure la musique jouée en fond pendant le jeu
  setUpAudio: function() {
    // Réduit le volume à 40% de sa valeur max
    document.getElementById('countdown').volume = 0.4;
  },
  // Active la possibilité de pouvoir retourner les cartes
  makeCardsClickable: function() {
    $('.cache').on('click', app.flipCard);
    $('.carte').removeClass('disabled');

    // Désactive les cartes si le joueur à perdu
    if ($("#progressbar").progressbar("value") == app.countdown) {
      app.disableCards();
    }
  },
  // Désactive la possibilité de pouvoir retourner les cartes
  disableCards: function() {
    $('.cache').off('click', app.flipCard);
    $('.carte').addClass('disabled');
  },
  // Configuration de la progressbar
  initProgressBar: function() {
    var progressbar = $("#progressbar");
    var progressLabel = $("#progressbar-label");

    progressbar.progressbar({
      value: 0,
      max: app.countdown,
      create: function() {
        // console.log('progressbar initialized');
      },
      change: function() {
        // Si la progressbar a été modifiée (sa value par ex)
        // On met à jour le texte affiché à l'intérieur
        progressLabel.text(
        app.countdown - progressbar.progressbar("value")
        + " seconds remaining");
      },
      complete: function() {
        // Lorsque les 60s sont écoulées
        progressLabel.text("Time's up !");
        app.disableCards();
        setTimeout(alert, 100, 'Perdu :(');
      }
    });

    // Valeur initiale de la progressbar
    progressLabel.text(app.countdown + ' seconds to win !');
  },
  // Démarre le timer
  startCountdown: function() {
    var progressbar = $("#progressbar");
    var progressValue = progressbar.progressbar("value");

    // On met à jour chaques secondes la value de la progressbar
    app.countdownInterval = setInterval(function() {
      progressValue = progressbar.progressbar("value");
      progressbar.progressbar("value", progressValue + 1);
      // On arrête le timer s'il a atteint la fin (i.e. les 60s)
      if (progressValue >= app.countdown - 1) {
        clearInterval(app.countdownInterval);
      }
    }, 1000);
  },
  // Permet de randomiser le tableau de carte
  shuffleCards: function(cardsList) {
    var j, x, i;
    for (i = cardsList.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = cardsList[i];
        cardsList[i] = cardsList[j];
        cardsList[j] = x;
    }
  },
  // Appelé lorsque l'on clique sur une carte
  flipCard: function() {
    // Evite à l'appli de bugger si on clique plusieurs fois rapidement sur la même carte
    if (!app.lastTwoCardsFlippedId.includes($(this).parent().index())) {
      // On ajoute au tableau contenant les 2 dernières cartes retounées, la carte sélectionnée
      app.lastTwoCardsFlippedId.push($(this).parent().index());
    }

    // Si on à retournée 2 cartes on test si elles sont identiques
    if (app.lastTwoCardsFlippedId.length === 2) {
      app.isAPair(app.lastTwoCardsFlippedId);
    }

    // On retourne la carte pour afficher l'image de la case sélectionné
    app.revealCard($(this));
  },
  // Retourne la carte sélectionnée côté image
  revealCard: function(card) {
    card.fadeOut(200, 'swing', function() {
      card.siblings('.image').fadeIn(200);
    });
  },
  // Permet de masquer les deux cartes passées en paramètre
  hideLastTwoCards: function(twoCards) {
    var firstCard = $('.carte').eq(twoCards[0]).find('.image');
    var secondCard = $('.carte').eq(twoCards[1]).find('.image');

    firstCard.fadeOut(200, 'swing', function() {
      firstCard.siblings('.cache').fadeIn(200);
    });

    secondCard.fadeOut(200, 'swing', function() {
      secondCard.siblings('.cache').fadeIn(200);
    });

    // Vide le tableau contenant les deux dernières cartes retournées
    app.lastTwoCardsFlippedId.length = 0;
  },
  // Permet de tester si les deux dernières cartes retournées forment une paire
  isAPair: function(pair) {
    // Les deux cartes forment une paire
    if (cards[pair[0]] === cards[pair[1]]) {
      // Vide le tableau contenant les deux dernières cartes retournées
      app.lastTwoCardsFlippedId.length = 0;
      // On en déduis donc de 2 le nombre de carte étant encore face cachée
      app.remainingCards -= 2;

      // S'il ne reste plus de carte cachée sur le plateau
      if (app.remainingCards === 0) {
        // Le joueur a gagné !
        app.endGame();
      }
    }
    // Les deux cartes ne forment pas une paire
    else {
      // On désactive le fait de pouvoir retourner les cartes
      app.disableCards();
      // Après 1 sec on réactive les cartes et on masque les 2 cartes retournées
      setTimeout(function() {
          app.makeCardsClickable(),
          app.hideLastTwoCards(pair)
        },
        1000
      );
    }
  },
  // Appelé lorsque le joueur à gagné
  endGame: function() {
    setTimeout(alert, 500, 'You win !');
    // On arrête le timer
    clearInterval(app.countdownInterval);
    // On désactive les cartes
    app.disableCards();
    // On désactive la progressbar
    $("#progressbar").progressbar("disable");
    // On met en pause l'audio
    document.getElementById('countdown').pause();
  }
};

$(app.init);
