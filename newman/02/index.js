const fs = require('fs');
const newman = require('newman');

newman.run({
    collection: require('./cocktail.postman_collection.json'),
    reporters: 'cli'
}, function (err, summary) {
    if (err) { throw err; }

    // Procesa los resultados y escribe en un archivo CSV
    let responses = [];

    summary.run.executions.forEach(exec => {
        let response
        try {
            response = exec.response.json();
        } catch (e) {
            // Manejar respuestas no JSON o errores de análisis
            return;
        }

        if (Array.isArray(response.drinks)) {
            responses = responses.concat(response.drinks.map(drink => ({
                strDrink: drink.strDrink,
                strInstructions: drink.strInstructions,
                strImageSource: drink.strImageSource
            })));
        }
    });

    const csvHeader = 'Drink,Instructions,ImageSource\n';
    const csvRows = responses.map(row => `${row.strDrink},${row.strInstructions},${row.strImageSource}`).join('\n');
    const csvContent = csvHeader + csvRows;

    fs.writeFileSync('output/output.csv', csvContent, 'utf8');
    console.log('CSV report generated successfully');
});