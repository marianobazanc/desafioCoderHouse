
import { Router }  from 'express'

import ProductCotroller from '../../controllers/products.controllers.js';

const router = Router()
const {
   getProduct,
   getProducts,
   createProduct,
   updateProduct,
   deleteProduct}= new ProductCotroller()

router.get('/',getProducts)
router.get('/:pid', getProduct)
router.post('/',createProduct)
router.put('/:pid', updateProduct)
router.delete('/:pid', deleteProduct)

export default router