document.addEventListener("DOMContentLoaded", function () {
    const table = document.getElementById("incidencesTable").getElementsByTagName("tbody")[0];

    fetch("http://206.189.234.55:3001/api/incidences/pending/2")
        .then((response) => response.json())
        .then((data) => {
            data.incidences.forEach((incidence, index) => {
                const row = table.insertRow();
                const id = row.insertCell(0);
                const name = row.insertCell(1);
                const typeIncidence = row.insertCell(2);
                const area = row.insertCell(3);
                const date = row.insertCell(4);
                const actions = row.insertCell(5);

                id.innerHTML = index + 1;
                name.innerHTML = incidence.person.name + ' ' + incidence.person.surname;
                typeIncidence.innerHTML = incidence.type;
                area.innerHTML = incidence.user.area.name;

                const fecha = new Date(incidence.incidenceDate);
                date.innerHTML = fecha.toLocaleDateString();

                actions.innerHTML = `
                    <button class="btn btn-primary btn-accept" data-id="${incidence.id}">Aceptar</button>
                    <button class="btn btn-danger btn-delete" data-id="${incidence.id}">Eliminar</button>
                `;

                const btnAccept = actions.querySelector(".btn-accept");
                const btnDelete = actions.querySelector(".btn-delete");

                btnAccept.addEventListener("click", () => {
                    updateIncidenceStatus(incidence.id, 4);
                });

                btnDelete.addEventListener("click", () => {
                    updateIncidenceStatus(incidence.id, 6);
                });

            });
            $("#incidencesTable").DataTable();
        })
        .catch((error) => {
            console.error("Error al obtener datos de la API", error);
        });
});
