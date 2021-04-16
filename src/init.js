import "./db";
import './models/Video';
import './models/User';
import app from './server';

const PORT= 3000;

app.listen(PORT, () => console.log(`✅ Server is running on port: http://localhost:${PORT}`));