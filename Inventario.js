import Articulo from "./Articulo.js";

export default class Inventario {
  constructor(tableProducto, tableInfo) {
    this._tableProducto = tableProducto;
    this._tableInfo = tableInfo;
    this._numProductos = 0;
    this._productos = "";
    this._articulos = [];

    this._initTables();
  }
  
  _initTables() {
    //localStorage.clear();
    let lsArticulos = JSON.parse(localStorage.getItem("articulos"));

    if (lsArticulos === null) {
      return;
    }

    for (var a of lsArticulos.keys()){ 
            
        this._addToTable(new Articulo(a));
    }
  }

  toString(){
    return "(" + this._articulos + ")";
  }

  _deleteArticulo(row, articulo){
  Swal.fire({
    type: "question",
    title: "Eliminar articulo",
    text: articulo.nombre,
    showCancelButton: true,
    confirmButtonText: "Si",
    cancelButtonText: "No"
  }).then(result => {
    if(result.value){
      let pos = this._findArticulo(articulo.codigo);
      this._articulos.splice(pos, 1);
      localStorage.setItem("articulos", JSON.stringify(this._articulo));
      row.remove();
      console.log("objeto borrado: ");
      console.log(this._articulos);
    } 
  });
  }
  _addDeleteToRow(row, articulo){

    let btnDelete = document.createElement("input");
    btnDelete.type = "button";
    btnDelete.value = "Eliminar";
    btnDelete.className = "btn btn-danger";
    btnDelete.addEventListener("click", () => {
      this._deleteArticulo(row, articulo);
    });

    row.cells[5].innerHTML = "";
    row.cells[5].appendChild(btnDelete);
  }


  _addToTable(articulo) {
    let row = this._tableProducto.insertRow(-1);

    let cellCodigo = row.insertCell(0);
    let cellNombre = row.insertCell(1);
    let cellPrecio = row.insertCell(2);
    let cellCantidad = row.insertCell(3);
    let cellDescripcion = row.insertCell(4);
    row.insertCell(5);
   

    cellCodigo.innerHTML = articulo.codigo;
    cellNombre.innerHTML = articulo.nombre;
    cellPrecio.innerHTML = articulo.precio;
    cellCantidad.innerHTML = articulo.cantidad;
    cellDescripcion.innerHTML = articulo.descripcion;
    this._addDeleteToRow(row, articulo);

    this._numProductos += parseInt(articulo.cantidad);
    this._productos += articulo.nombre + "<br>";
    
    this._tableInfo.rows[0].cells[1].innerHTML = this._numProductos;
    this._tableInfo.rows[1].cells[1].innerHTML = this._productos;


    let objArticulo = {
        codigo : articulo.codigo,
        nombre : articulo.nombre,
        precio : articulo.precio,
        cantidad : articulo.cantidad,
        descripcion : articulo.descripcion
      };

    this._articulos.push(objArticulo);
    localStorage.setItem("articulos", JSON.stringify(this._articulos));
        console.log(this._articulos);
  }

  _findArticulo(codigo){
    let result = -1;
    this._articulos.forEach(
      (articulo, index) => {
      if(articulo.codigo === codigo){
        result = index;
        return;
      }
    })
    return result;
  }

  addArticulo(articulo) {
    if(this._findArticulo(articulo.codigo) >= 0){
      Swal.fire({
        type: "error",
        title: "Error",
        text: "Este articulo ya se encuentra registrado"
      });
      return;
    } 
    this._addToTable(articulo);
    localStorage.setItem("articulos", JSON.stringify(this._articulos));
    Swal.fire({
      type: "success",
      title: "Correcto",
      text: "El articulo fue agregado al inventario"
    });
  }
}