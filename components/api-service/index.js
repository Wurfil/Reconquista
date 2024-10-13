export async function getDocuments() {
    const {data, error} = await useBaseFetch('/documents', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    // return [{
    //     id: 0,
    //     title: 'Коллективный договор',
    //     branch: 'Главное предприятие',
    // },
    //     {
    //         id: 1,
    //         title: 'Уголовные дела заколюченных',
    //         branch: 'ТрансСиб',
    //     }
    // ];
    return data.value
}
