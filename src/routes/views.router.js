import { Router }  from 'express'

import productManagerMongoose from '../daos/productManagerMongoose.js'

import cartsManagerMongoose from '../daos/cartsManagerMongoose.js'
import { auth } from '../middlewares/auth.middleware.js';

const productManager = new productManagerMongoose();
const cartsManager = new cartsManagerMongoose();

const router = Router()

router.get('/products', async (req, res)=>{
    let { limit , nropage , disponibilidad, sort } = req.query

    if (typeof limit === "undefined") { limit = 10;  }
    if (typeof nropage === "undefined") {nropage = 1;}
    if (typeof sort === "undefined") { sort = 1; }

    const  { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage } = await (productManager.getProducts(limit,nropage, sort));
    const nombre="" 
    
    res.render('home', {productos:docs,
        page, 
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage, nombre, role:false})
})
router.get('/', async (req, res)=>{
    res.render('login',{} )
})

router.get('/register', async (req, res)=>{
    res.render('register',{} )
})

 router.get('/carts/:cid', async (req, res)=>{
      const { cid } = req.params
      const carrito= await (cartsManager.getCartsById(cid));
      const productos = carrito.products
      res.render('carts', {productos})
 })

 router.post('/products', async (req, res) => {
    const {prodId , txtCantidad , carId} = req.body

    const cart = await cartsManager.getCartsById(carId)

    const result= await (cartsManager.addCarts(carId,prodId,txtCantidad));
    res.redirect('/carts/'+ carId)
}); 

router.get('/realtimeproducts',auth, async(req, res)=>{
    const { socketServer } = req
  
     socketServer.on('connection', async (socket) => {
        socket.on('eliminarProducto', async data=>{
            const { id } = data
            console.log ('socket', id)
            await productManager.deleteProduct(id)
         })      

       const productos= await (productManager.getProducts(10,1,1));
       socket.emit("cargarProductos",  productos.docs);
    });
    const nombre= req.session.user.first_name    
     res.render('realtimeproducts', { 
        nombre
     })
   
})
export default router