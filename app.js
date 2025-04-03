const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoute = require("./routes/authRoute");
const reportRoute = require("./routes/reportRoute");
const narrativeRoute = require("./routes/narrativeRoute");
const userRoute = require("./routes/userRoute");
const policeSectorRoute = require("./routes/policeSectorRoute");
const mediaRoutes = require("./routes/mediaRoute");

const morgan = require("morgan");
const app = express();
const helmet = require("helmet");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());

app.use("/api/auth", authRoute);
app.use("/api/reports", reportRoute);
app.use("/api/narratives", narrativeRoute);
app.use("/api/users", userRoute);
app.use("/api/police-sector", policeSectorRoute);

app.use("/media", mediaRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
