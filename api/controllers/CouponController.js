/**
 * CouponController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    //点击小标题跳转的优惠券详情界面
    detail: async function (req, res) {
        if (req.method === 'GET') {
            var thatCpInfo = await Coupon.findOne(req.params.id); //找到的值会返回一个带有id的参数
            var isRedeem = req.session.username ? true : false; // 用户是否登录，用于判断 兑换按钮是否显示
            isRedeem = !req.session.role || req.session.role === 'visitor' ? false : true; // 访客不显示兑换按钮
            if (req.session.userId) { // 如果用户已登录，判断该优惠券是否被兑换过
                var user = await User.findOne({ id: req.session.userId }).populate('CPIN');
                var cpInfo = user.CPIN;
                for (let cp of coupon) {
                    if (cp.id === Number(req.params.id)) {
                        isRedeem = false;
                        break;
                    }
                }
                console.log(coupon)
            }
            console.log(req.session.userId)
            console.log('isRedeem', isRedeem)
            return res.view('coupon/detail', { Coupon: thatCpInfo, isRedeem });
        }
    },
    // action create coupon
    create: async function (req, res) {

        if (req.session.role !== 'admin') {
            return res.status(401).json("No authority");
        }
        // If gose for GET, show create page
        if (req.method == "GET") {
            return res.view('coupon/create');
        }

        // If gose for POST, save data
        var coupon = await Coupon.create(req.body).fetch();
        return res.redirect('/admin');
    },

    //查看数据库中存储的项目
    json: async function (req, res) {

        var everyones = await Coupon.find();

        return res.json(everyones);
    },

    // action admin
    admin: async function (req, res) {
        if (req.session.role !== 'admin') {
            return res.status(401).json("No authority");
        }
        var allCoupon = await Coupon.find();
        return res.view('coupon/admin', { coupons: allCoupon });
    },

    MyRedeemedCoupons: async function (req, res) {

        if(req.wantsJSON){
            var user = await User.findOne(req.session.userId).populate("CPIN");
            return res.json(user);
        }

        return res.view('coupon/redeem');
    },

    UserRedeemed: async function (req, res) {
        var coupon = await Coupon.findOne(req.params.id).populate('userRedeem');
        var users = coupon.userRedeem;

        return res.view('Coupon/member', { users });//带着users的json返回member
    },

    // action update coupon
    update: async function (req, res) {
        if (req.session.role !== 'admin') {
            return res.status(401).json("No authority");
        }
        if (req.method == "GET") {
            var theCoupon = await Coupon.findOne(req.params.id);

            if (!theCoupon) {
                return res.notFound();
            } else {
                return res.view('coupon/update', { coupon: theCoupon });
            }
        } else {
            var updateCoupon = await Coupon.updateOne(req.params.id).set(req.body);

            if (!updateCoupon) {
                return res.notFound();
            } else {
                return res.redirect('/admin');
            }
        }
    },

    // action delete coupon
    delete: async function (req, res) {
        if (req.session.role !== 'admin') {
            return res.status(401).json("No authority");
        }
        var deletedCoupon = await Coupon.destroyOne(req.params.id);

        if (!deletedCoupon) {
            return res.notFound();
        } else {
            return res.redirect('/admin');
        }
    },

    // action search coupon
    search: async function (req, res) {
        var whereClause = {};

        // search by region
        if (req.query.region) {
            whereClause.region = {
                contains: req.query.region
            };
        }

        // !HARD!
        // search by coins
        // (use if-else statement to recognize and make right whereClause like: x<=coins<=y; x<=coins; coins<=y)
        var parsedCoinsMin = parseInt(req.query.coinsMin);
        var parsedCoinsMax = parseInt(req.query.coinsMax);

        if (!isNaN(parsedCoinsMin) && !isNaN(parsedCoinsMax)) {
            whereClause.coins = {
                '>=': parsedCoinsMin,
                '<=': parsedCoinsMax
            };
        } else if (!isNaN(parsedCoinsMin)) {
            whereClause.coins = {
                '>=': parsedCoinsMin
            };
        } else if (!isNaN(parsedCoinsMax)) {
            whereClause.coins = {
                '<=': parsedCoinsMax
            };
        }

        // search by expire date
        if (req.query.expire) {
            whereClause.expire = req.query.expire;
        }

        // !!TOO HARD!!
        // result set for ALL SATISFIED COUPONS
        // (used for cauculate the length of all satisfied coupons ↓)
        var coupnsResultAll = await Coupon.find({
            where: whereClause
        });

        // length for ALL SATISFIED COUPONS
        var resultKeysArr = Object.keys(coupnsResultAll);
        var count = resultKeysArr.length;

        // search
        var limit = Math.max(req.query.limit, 2) || 2;
        var offset = Math.max(req.query.offset, 0) || 0;

        // result set for Search COUPONS
        // (the result changes for each click on page buttons)
        var coupnsResult = await Coupon.find({
            where: whereClause,
            limit: limit,
            skip: offset
        });

        // save the last request parameters for the baseUrl of pagination function in search.ejs
        // (maintain the search result be the same for click on page buttons)
        var requests = req.query;

        return res.view('coupon/search', {
            coupons: coupnsResult,
            numOfRecords: count,
            request: requests
        });
    },

    // homepage action
    homepage: async function (req, res) {

        if(req.wantsJSON){
            var coupons=await Coupon.find();
            return res.json(coupons);
        }

        // coupons for HK Island
        var hki = await Coupon.find({
            where: { region: 'Hong Kong Island' },
            limit: 2
        });

        // coupons for Kowloon
        var kl = await Coupon.find({
            where: { region: 'Kowloon' },
            limit: 2
        });

        // coupons for New Territories
        var nt = await Coupon.find({
            where: { region: 'New Territories' },
            limit: 2
        });

        return res.view('pages/homepage', {
            hkiCoupons: hki,
            klCoupons: kl,
            ntCoupons: nt
        });
    },

    // details action
    details: async function (req, res) {
        var coupon = await Coupon.findOne(req.params.id);
        return res.view('coupon/details', { coupon: coupon });
    }
};