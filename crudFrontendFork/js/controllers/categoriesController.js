import{
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "../services/categoryServices.js";

document.addEventListener("DOMContentLoaded", ()=>{
    const tableBody = document.querySelector("#categoriesTable tbody");//Tbody - Cuerpo de la tabla
    const form = document.getElementById("categoryForm");//Formulario dentro del modal
    const modal = new bootstrap.Modal(document.getElementById("categoryModal"));//Modal
    const lblmodal = document.getElementById("categoryModalLabel"); //titulo del modal
    const btnAdd = document.getElementById("btnAddCategory"); //btn apra abrir modal

    init(); //Este método permite cargar las categorías en la tablas

    //Accion cuando el btn de Agregar nueva categoria es presionado (Abrir modal)
    btnAdd.addEventListener("click", ()=>{
        form.reset();
        form.categoryId.value = ""; //No enviamos ID, ya que estamos agregando
        lblmodal.textContent = "Agregar categoría";
        modal.show();
    })

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); //Evitamos que el formulario se envpie al hacer "submit"
        const id = form.categoryId.value; //Obtenemos el ID
        const data = {
            nombreCategoria: form.categoryName.value.trim(),
            descripcion: form.categoryDescription.value.trim()
        };
        
        try{
            //Si hay un ID, significa que estamos actualizandou
            if(id){
                await updateCategory(id, data);
            }

            //Si no hay ID significa q estamos agregando
            else{
                await createCategory (data);
            }
            modal.hide(); //Se oculta el formulario después de agregar/actualizar
            await loadCategories(); //Nos permite cargar las categorías
        }
        catch(err){
            console.error("Error: ", err);
        }

    });

    async function loadCategories() {

        try{
            const categories = await getCategories();
            tableBody.innerHTML = ""; //Vaciamos la tabla

            //Verificamos si NO hay categorías
            if(!categories || categories.length == 0){
                tableBody.innerHTML = '<td colspan = "5"> Actualmente no hay registros</td>';
                return; //Evitamos que se ejecute el resto del código
            }

            categories.forEach((cat)=>{
                const tr = document.createElement("tr"); //Se crea el elemento con JS
                tr.innerHTML = `
                    <td>${cat.idCategoria}</td>
                    <td>${cat.nombreCategoria}</td>
                    <td>${cat.descripcion}</td>
                    <td>${cat.fechaCreacion}</td>
                    <td>
                    <button class = "btn btn-sm btn-outline-secondary edit-btn">
                        svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-square-pen">
                        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>
                    </svg>
                        <button class="btn btn-sm btn-outline-secondary edit-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-square-pen">
                            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>
                            </svg>
                        </button>
    
                        <button class="btn btn-sm btn-outline-danger delete-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-trash">
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                            <path d="M3 6h18"/>
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </td>
                `;

                //Funcionalidades para btns de editar
                tr.querySelector(".edit-btn").addEventListener("click", ()=>{
                    form.categoryId.value = cat.idCategoria;
                    form.categoryName.value = cat.nombreCategoria;
                    form.categoryDescription.value = cat.descripcion;
                    lblmodal.textContent = "Editar Categoría";

                    //El modal se carga hasta q el form ya tenga los datos cargados
                    modal.show();
                });

                //Funcionalidad par botones de Eliminar
                tr.querySelector(".delete-btn").addEventListener("click", ()=>{
                    if(confirm("¿Desea eliminar esta categoría?")){
                        deleteCategory(cat.idCategoria).then(loadCategories);
                    }
                });

                tableBody.appendChild(tr); //Al TBODY se le concatena la nueva fila creada
            });
        }
        catch(err){
            console.error("Error cargando categorías: ", err);
        }
    }

    function init(){
        loadCategories();
    }

}); //Esto no se toca. 