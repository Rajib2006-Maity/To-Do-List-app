require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Todo = require("./models/Todo");
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Validate MongoDB ObjectId
const validId = (req, res, next) => {
    if (mongoose.isValidObjectId(req.params.id)) {
        next();
    } else {
        res.status(400).json({ error: "Invalid id" });
    }
};

// ==================== GET ALL TODOS ====================
app.get("/api/todos", async (req, res, next) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.json(todos);
    } catch (err) {
        next(err);
    }
});

// ==================== CREATE TODO ====================
app.post("/api/todos", async (req, res, next) => {
    try {
        const title = (req.body.title || "").trim();

        if (!title) {
            return res.status(400).json({
                error: "Title is required"
            });
        }

        const todo = await Todo.create({ title });

        res.status(201).json(todo);
    } catch (err) {
        next(err);
    }
});

// ==================== UPDATE TODO ====================
app.patch("/api/todos/:id", validId, async (req, res, next) => {
    try {
        const update = {};

        // Update title
        if (typeof req.body.title === "string") {
            const title = req.body.title.trim();

            if (!title) {
                return res.status(400).json({
                    error: "Title can't be empty"
                });
            }

            update.title = title;
        }

        // Update completed status
        if (typeof req.body.completed === "boolean") {
            update.completed = req.body.completed;
        }

        const todo = await Todo.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true }
        );

        if (!todo) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.json(todo);
    } catch (err) {
        next(err);
    }
});

// ==================== DELETE ONE TODO ====================
app.delete("/api/todos/:id", validId, async (req, res, next) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);

        if (!todo) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

// ==================== DELETE ALL COMPLETED ====================
app.delete("/api/todos", async (req, res, next) => {
    try {
        await Todo.deleteMany({ completed: true });

        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        error: "Something went wrong"
    });
});

// ==================== SERVER ====================
const PORT = process.env.PORT || 3000;

mongoose
    .connect(
        process.env.MONGO_URI ||
        "mongodb://127.0.0.1:27017/todo_app"
    )
    .then(() => {
        console.log("MongoDB connected");

        app.listen(PORT, () => {
            console.log(`http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error(
            "MongoDB connection failed:",
            err.message
        );

        process.exit(1);
    });

