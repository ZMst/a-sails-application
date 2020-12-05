/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  '/': { view: 'pages/homepage' },


  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/

  // CREATE
  'GET /create': 'CouponController.create',
  'POST /create': 'CouponController.create',

  // ADMIN
  'GET /admin': 'CouponController.admin',

  // UPDATE
  'GET /update/:id': 'CouponController.update',
  'POST /update/:id': 'CouponController.update',

  // DELETE
  'GET /delete/:id': 'CouponController.delete',

  'GET /user/login' : 'UserController.login',
  'POST /user/login' : 'UserController.login',
  'GET /user/logout' : 'UserController.logout',
  'POST /user/logout' : 'UserController.logout',

  'GET /Coupon/redeem':
    'CouponController.MyRedeemedCoupons',
  'POST /Coupon/redeem':
    'CouponController.MyRedeemedCoupons',
  'GET /User/:id/userRedeem': 'User.populate',//ajax请求的路由
  'GET /Coupon/UserRedeemed/:id': 'CouponController.UserRedeemed',
  'POST /Coupon/UserRedeemed/:id': 'CouponController.UserRedeemed',
  'GET /User/Redeem': 'UserController.Redeem',

  'GET /getSession': 'UserController.getSession',

  'POST /user/Redeem': 'UserController.Redeem',

  // SEARCH and PAGINATION
  'GET /search': 'CouponController.search',
  

  // HOMEPAGE
  'GET /': 'CouponController.homepage',

  // DETAILS
  'GET /details/:id': 'CouponController.details'
};