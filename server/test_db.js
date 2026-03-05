const mongoose = require('mongoose');
const uri = "mongodb://jairajchilukalalinkedin_db_user:6t4bst5p1pWJhYhT@ac-f86h32j-shard-00-00.ik7bxrm.mongodb.net:27017,ac-f86h32j-shard-00-01.ik7bxrm.mongodb.net:27017,ac-f86h32j-shard-00-02.ik7bxrm.mongodb.net:27017/campushub?ssl=true&replicaSet=atlas-13p03p-shard-0&authSource=admin&retryWrites=true&w=majority";

async function test() {
    try {
        console.log("Connecting directly...");
        await mongoose.connect(uri);
        console.log("✅ Success! Cloud database is reachable.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Still failing:", err.message);
        process.exit(1);
    }
}
test();
