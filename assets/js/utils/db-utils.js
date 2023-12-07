//POST -> Gestiones de datos registros o updates pasen por aquí

const incidencesDB = new PouchDB('incidences');

const saveInicidences = (incidence) => {
    incidence._id = new Date().toISOString();
    return incidencesDB.put(incidence).then((res) => {
        self.registration.sync.register('incidence-status-post');
        const response = {
            registered: true,
            offline: true,
        };
        return new Response(JSON.stringify(response));
    }).catch((err) => {
        console.log(err);
        const response = {
            registered: false,
            offline: true,
        };
        return new Response(JSON.stringify(response));
    });
};

const saveInicidenceToApi = () => {
    const incidences = [];
    return incidencesDB.allDocs({include_docs: true, descending: true}).then( async (docs) => {
        const {rows} = docs;
        for(const row of rows){
            const {doc} = row;
            try {
                //'http://206.189.234.55/api/incidences/pending/2'
                //erielit
                //admin
                const response = await fetch('http://206.189.234.55/api/incidences/status', {
                    method : 'POST',
                    body: JSON.stringify(doc),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
                );
                const data = await response.json();

                if (data['changed']) {
                    incidences.push(response);
                }
            } catch (error) {
                console.log(error);
            } finally {
                return incidencesDB.remove(doc);
            }
        }
        return Promise.all([...incidences, getAllIncidencesPending()]);
    });
};