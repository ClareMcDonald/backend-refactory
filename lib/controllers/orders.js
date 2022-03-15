const { Router } = require('express');
const Order = require('../models/Order');
const pool = require('../utils/pool');

module.exports = Router()
  .post('/', async (req, res) => {
    const order = await Order.insert(req.body);

    res.json(order);
  })

  .get('/:id', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM orders WHERE id=$1;', [
      req.params.id,
    ]);

    if (!rows[0]) return null;
    const order = new Order(rows[0]);

    res.json(order);
  })

  .get('/', async (req, res) => {
    const orders = await Order.getAll();

    res.json(orders);
  })

  .patch('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const existingOrder = await Order.updateById(id, req.body);

      if (!existingOrder) {
        const error = new Error(`Order ${id} not found`);
        error.status = 404;
        throw error;
      }

      res.json(existingOrder);
    } catch (error) {
      next(error);
    }
  })

  .delete('/:id', async (req, res) => {
    const order = await Order.deleteById(req.params.id);

    res.json(order);
  });
