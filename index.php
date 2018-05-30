<!DOCTYPE html>
<html>

  <head>
    <title>Memory</title>

    <meta charset="utf-8">

    <link href="https://fonts.googleapis.com/css?family=Permanent+Marker" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Josefin+Sans" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
  </head>

  <body>

    <header>
      <h1>Jeu de mémoire</h1>
      <div id="startDiv">
        <input id="startBtn" type="button" value="START">
      </div>
      <audio id="countdown" controls controlsList="nodownload">
        <source src="docs/audios/countdown60s.mp3" type="audio/mpeg">
      Your browser does not support the audio element.
      </audio>
    </header>

    <main>
      <div id="board">
        <?php for ($i=0; $i < 28; $i++): ?>
          <div class="carte">
            <div class="image"></div>
            <div class="cache"></div>
          </div>
        <?php endfor; ?>
      </div>

      <div id="progressbar">
        <div id="progressbar-label"></div>
      </div>
    </main>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"></script>

    <script src="datas.js" type="text/javascript"></script>
    <script src="script.js" type="text/javascript"></script>
  </body>

</html>
