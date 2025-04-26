const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

const colectivosSimulados = [
    { id: 1, lat: -34.6037, lng: -58.3816 }, // Obelisco
    { id: 2, lat: -34.6091, lng: -58.3923 }, // Congreso
    { id: 3, lat: -34.6012, lng: -58.3841 }, // Teatro Colón
  ];

function MovimientoColectivos() {
    colectivosSimulados.forEach(colectivo => {
        colectivo.lat += (Math.random() - 0.5) * 0.001;
        colectivo.lng += (Math.random() - 0.5) * 0.001;
    })
}

app.get('/colectivos', (req, res) => {
    MovimientoColectivos();
    res.json(colectivosSimulados);
});

app.get('/status', (req, res) => {
    console.log('Servidor corriendo')
});
app.listen(PORT, () => {
    console.log(`Backend escuchando en puerto ${PORT}`);
});