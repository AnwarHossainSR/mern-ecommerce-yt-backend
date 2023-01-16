const express = require('express');
const {
  getDashboardStateAndGraphData,
} = require('../controllers/dashboardController');
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getAdminProducts,
  getProductReviews,
  deleteReview,
} = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const upload = require('../utils/multer');

const router = express.Router();

router.route('/products').get(getAllProducts);
router
  .route('/admin/products')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getAdminProducts);
router
  .route('/admin/product/new')
  .post(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    upload.single('image'),
    createProduct
  );
router
  .route('/admin/product/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

router
  .route('/admin/dashboard')
  .get(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    getDashboardStateAndGraphData
  );

router.route('/product/:id').get(getProductDetails);
router.route('/review').put(isAuthenticatedUser, createProductReview);

router
  .route('/reviews')
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteReview);

module.exports = router;
