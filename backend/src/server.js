const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());

const teamsRoute = require('./routes/teams');
const playersRoute = require('./routes/players');
const trophieRoute = require('./routes/trophies');
const eventsRoute = require('./routes/events');
const historicelevenRoute = require('./routes/historic-eleven');
const notableplayersRoute = require('./routes/notable-players');
const teamstrophiesRoute = require('./routes/teams-trophies');

const port = process.env.PORT || 3000;

// Routes
app.use('/api/', teamsRoute);
app.use('/api/', playersRoute);
app.use('/api/', trophieRoute);
app.use('/api/', eventsRoute);
app.use('/api/', historicelevenRoute);
app.use('/api/', notableplayersRoute);
app.use('/api/', teamstrophiesRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
