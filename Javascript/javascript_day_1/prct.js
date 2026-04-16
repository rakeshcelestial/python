/* <!DOCTYPE html>
<html>
    <head>
        <style>
            #s{
                font-size : 40px;
            }
        </style>
    </head>
    <body>
        <div>
            <h1 id = "s">
                Hi 
            </h1>

        </div>
        <script>
            let a = document.getElementById("s")
        </script>
    </body>
</html> */
function outer() {
  let count = 0;

  function inner() {
    count++;
    console.log(count);
  }

  return inner;
}

const fn = outer(); // outer is executed
fn(); // 1
fn(); // 2
fn(); // 3
