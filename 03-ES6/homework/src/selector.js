var traverseDomAndCollectElements = function (matchFunc, startEl) {
  var resultSet = [];

  if (typeof startEl === "undefined") {
    startEl = document.body;
  }

  // recorre el árbol del DOM y recolecta elementos que matchien en resultSet
  // usa matchFunc para identificar elementos que matchien

  // TU CÓDIGO AQUÍ
  if(matchFunctionMaker(startEl)) resultSet.push(startEl);

  for (let i = 0; i < startEl.children.length; i++){ //recorrer todos los hijos de startEl
    let aux = traverseDomAndCollectElements(matchFunctionMaker,startEl.children[i]); //recoge los hijos
    resultSet = [...resultSet, ...aux]; //con esto concatenamos ambos arrays.
  }

  return resultSet;

};

// Detecta y devuelve el tipo de selector
// devuelve uno de estos tipos: id, class, tag.class, tag

var selectorTypeMatcher = function (selector) {
  // tu código aquí
  if (selector[0] === "#") return "id"; //los ID comienzan con #
  if (selector[0] === ".") return "class"; //las clases comienzan con .
  if (selector.split(".").length > 1) return "tag.class"; //dividimos la palabra y si el punto no está al comienzo significa que es un tag class
  return "tag"; //Si no se cumple ninguno, retornamos tag
};

// NOTA SOBRE LA FUNCIÓN MATCH
// recuerda, la función matchFunction devuelta toma un elemento como un
// parametro y devuelve true/false dependiendo si el elemento
// matchea el selector.

let matchFunctionMaker = function (selector) { //"#hola", ".class", "div", "span.hola"
  let selectorType = selectorTypeMatcher(selector);
  let matchFunction;
  if (selectorType === "id") {

    //Lo que hace esta función es comparar el element con el selector, si son iguales retorna true y si no es asi retorna false
    matchFunction = (element) => `#${element.id}` === selector //el elemento es una etiqueta de HTML
    //Lo que hicimos fue definir la variable (es una función).
    //Usamos element.id para acceder a la propiedad del elemento ya que se recibe como un objeto
    //le agregamos el # porque el selector viene con el pero el elemento no

  } else if (selectorType === "class") {

    matchFunction = (element) => {
      let classes = element.classList; //esto es un método que te da un array con todas las clases del element

      return classes.contains(selector.slice(1)); //Una mejor forma de hacerlo
      //Acá usamos slice desde la posición 1 para no incluir el punto de selector a la hora de comparar


    //   for(let i = 0; i < classes.length; i++){
    //     if(`.${classes[i]}` === selector) return true; //Busca el selector entre las clases del elemento
    //   }
    //     return false; //Si no encuentra coincidencias retorna false
  } 

  } else if (selectorType === "tag.class") {

    matchFunction = (element) => {
      const [tag, className] =selector.split('.') //Separamos el string en un array con las dos palabras. Separamos con el .


      //Tenemos que aplicar esta recursión para ambos métodos ya que son de tipo distinto
      return matchFunctionMaker(tag)(element) && matchFunctionMaker(`.${className}`)(element);
      //ponemos el (element para llamar la otra función)
      //eso es como decir: let match = matchFunctionMaker(tag)
                         //match(element)
    }


  } else if (selectorType === "tag") {

   //tagname es una propiedad que te permite acceder al elemento HTML
   //lo devuelve en string y en mayúsculas, por eso es necesario transformar selector a mayúscula
    matchFunction = (element) => element.tagName === selector.toUpperCase();


  }
  return matchFunction;
};

var $ = function (selector) {
  var elements;
  var selectorMatchFunc = matchFunctionMaker(selector);
  elements = traverseDomAndCollectElements(selectorMatchFunc);
  return elements;
};
