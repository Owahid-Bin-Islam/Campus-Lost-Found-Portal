const pool = require("../config/db");

exports.getAllItems = async (req, res) => {
    try {
        const { search, status, category } = req.query;

        let sql = `
            SELECT 
                items.*,
                users.name AS reporter_name,
                users.email AS reporter_email
            FROM items
            JOIN users ON items.user_id = users.id
            WHERE 1=1
        `;

        const params = [];

        if (search) {
            sql += `
                AND (
                    items.title LIKE ?
                    OR items.description LIKE ?
                    OR items.location LIKE ?
                    OR items.category LIKE ?
                )
            `;

            const searchValue = `%${search}%`;

            params.push(
                searchValue,
                searchValue,
                searchValue,
                searchValue
            );
        }

        if (status) {
            sql += " AND items.status = ?";
            params.push(status);
        }

        if (category) {
            sql += " AND items.category = ?";
            params.push(category);
        }

        sql += " ORDER BY items.created_at DESC";

        const [rows] = await pool.execute(sql, params);

        res.json({
            success: true,
            items: rows
        });

    } catch (error) {
        console.error("Get items error:", error);

        res.status(500).json({
            success: false,
            message: error.sqlMessage || error.message || error.code || String(error)
        });
    }
};


exports.getItemById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.execute(
            `
            SELECT 
                items.*,
                users.name AS reporter_name,
                users.email AS reporter_email
            FROM items
            JOIN users ON items.user_id = users.id
            WHERE items.id = ?
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        res.json({
            success: true,
            item: rows[0]
        });

    } catch (error) {
        console.error("Get item error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load item"
        });
    }
};


exports.createItem = async (req, res) => {
    try {
        const {
            title,
            category,
            description,
            status,
            location,
            date,
            contact
        } = req.body;

        if (
            !title ||
            !category ||
            !status ||
            !location ||
            !date ||
            !contact
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields"
            });
        }

        if (!["lost", "found", "recovered"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid item status"
            });
        }

        const image = req.file
            ? `/uploads/${req.file.filename}`
            : null;

        const [result] = await pool.execute(
            `
            INSERT INTO items
            (
                title,
                category,
                description,
                status,
                location,
                date,
                image,
                contact,
                user_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                title,
                category,
                description || null,
                status,
                location,
                date,
                image,
                contact,
                req.user.id
            ]
        );

        res.status(201).json({
            success: true,
            message: "Item report created successfully",
            itemId: result.insertId
        });

    } catch (error) {
        console.error("Create item error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create item report"
        });
    }
};


exports.updateItem = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            category,
            description,
            status,
            location,
            date,
            contact
        } = req.body;

        const [existing] = await pool.execute(
            "SELECT * FROM items WHERE id = ?",
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        if (
            req.user.role !== "admin" &&
            existing[0].user_id !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "You can only edit your own reports"
            });
        }

        let image = existing[0].image;

        if (req.file) {
            image = `/uploads/${req.file.filename}`;
        }

        await pool.execute(
            `
            UPDATE items
            SET
                title = ?,
                category = ?,
                description = ?,
                status = ?,
                location = ?,
                date = ?,
                image = ?,
                contact = ?
            WHERE id = ?
            `,
            [
                title,
                category,
                description || null,
                status,
                location,
                date,
                image,
                contact,
                id
            ]
        );

        res.json({
            success: true,
            message: "Item report updated successfully"
        });

    } catch (error) {
        console.error("Update item error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update item"
        });
    }
};


exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await pool.execute(
            "SELECT * FROM items WHERE id = ?",
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        if (
            req.user.role !== "admin" &&
            existing[0].user_id !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own reports"
            });
        }

        await pool.execute(
            "DELETE FROM items WHERE id = ?",
            [id]
        );

        res.json({
            success: true,
            message: "Item report deleted successfully"
        });

    } catch (error) {
        console.error("Delete item error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete item"
        });
    }
};

exports.getMyReports = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `
            SELECT
                items.*,
                users.name AS reporter_name,
                users.email AS reporter_email
            FROM items
            JOIN users ON items.user_id = users.id
            WHERE items.user_id = ?
            ORDER BY items.created_at DESC
            `,
            [req.user.id]
        );

        res.json({
            success: true,
            items: rows
        });

    } catch (error) {
        console.error("Get my reports error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load your reports"
        });
    }
};
