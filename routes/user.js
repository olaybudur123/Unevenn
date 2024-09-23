import express from 'express';
// controllers
import user from '../controllers/user.js';

const router = express.Router();



router
  .post('/getUser', user.onGetUser)
  .get('/getAllUsers', user.onGetAllUsers)
  .delete('/deleteUser/:id', user.onDeleteUser) 
  .post('/addOrder', user.onAddOrder)
  .post('/getLastOrders', user.onGetLastOrders)
  .post('/getAllOrders', user.onGetAllOrders)
  .post('/tiktokSearch', user.onTiktokSearch)
  .get('/getTiktokUser', user.onGetTiktokUser)
  .post('/addAccount', user.onAddAccount)
  .delete('/deleteAccount/:id', user.onDeleteAccount) 

export default router;

 