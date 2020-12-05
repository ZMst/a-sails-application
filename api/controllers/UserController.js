/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    //ajax实现login
    login: async function (req, res) {

        if (req.method === "GET") { return res.view('user/login'); }

        if (!req.body.username || !req.body.password) return res.badRequest();

        var user = await User.findOne({ username: req.body.username });

        if (!user) return res.status(401).json("User not found");

        var match = await sails.bcrypt.compare(req.body.password, user.password);

        if (!match) { return res.status(401).json("Wrong Password"); }

        // Reuse existing session 重现已经存在的会话功能
        if (!req.session.username) {
            // req.session.id = user.id;
            req.session.userId = user.id;
            req.session.role = user.role;
            req.session.username = user.username;//如果曾经登录进去过的用户名，为了保证所有的页面都可以使用session的跟踪功能，采用这个代码块
            return res.json({ message: 'welcome~' + ' ' + user.username });
        }

        // Start a new session for the new login user
        req.session.regenerate((err) => { //重现session功能出错【服务端出错输出的错误码】帮助技术人员判断错误类型

            if (err) { return res.serverError(err); }
            // req.session.id = user.id;
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.role = user.role;//因为曾经没登录过无法重现，证明是新登录的用户，系统会分配新的session的跟踪功能给新用户
            return res.json({ message: 'welcome' + ' ' + user.username });
        });
    },


    //登出界面，返回主页 对应地区名字分类
    logout: async function (req, res) {
        req.session.destroy(function (err) {

            if (err) return res.serverError(err);

            return res.redirect("/");
        });
        //       var Region1 =  await Coupon.find({region:'HK Island'});
        //       var Region2 =  await Coupon.find({ region: 'Kowloon' });
        //       var Region3 =  await Coupon.find({ region: 'New Territories' });
        //       var answer1 = [];
        //       var answer2 = [];
        //       var answer3 = [];
        //       //定义了三个var 和 answer
        //       await datafliter(Region1,Region2,Region3);
        //       async function datafliter(Region1,Region2,Region3){
        //         answer1 = forRegion(Region1);
        //         answer2 = forRegion(Region2);
        //         answer3 = forRegion(Region3);

        //       }
        //   //遍历每一个地区的优惠券，按照地区分类之后按照日期排序
        //       function forRegion(Region){
        //         var answer = [];
        //         for (let i = 0; i < Region.length; i++) {
        //           if (answer.length === 0) {//没数据时候
        //             answer.push(Region[i]);
        //           } else if (answer.length === 1) {//有数据时候两个开始比
        //             if (dateCompare(Region[i].dateValidTill, answer[0].dateValidTill)) {
        //               answer.unshift(Region[i]);
        //             } else {
        //               answer.push(Region[i]);
        //             }
        //           } else if (dateCompare(Region[i].dateValidTill, answer[1].dateValidTill)) {
        //             if (dateCompare(Region[i].dateValidTill, answer[0].dateValidTill)) {
        //               answer.unshift(Region[i]);
        //               answer.pop();
        //             } else {
        //               answer.pop();
        //               answer.push(Region[i]);
        //             }
        //           }
        //         }
        //         return answer;
        //       }
        //   //日期排序的function 在遍历地区里调用
        //       function dateCompare(str1,str2){
        //         //2020/11/12
        //         var a1 = str1.split('/');
        //         var a2 = str2.split('/');
        //         for (let i = 0; i < a1.length; i++) {
        //           if (parseInt(a1[i]) < parseInt(a2[i])) {
        //             return true;
        //           } else if (parseInt(a1[i]) === parseInt(a2[i])) {
        //             continue;
        //           } else {
        //             return false;
        //           }
        //         }
        //       }
        //输出按照日期排序和地区分类的优惠券
        //   req.session.destroy((err) => {	if (err) {return res.serverError(err);}
        //     return res.view('pages/homepage',{ Region11: answer1[0],
        //       Region12: answer1[1],
        //       Region21: answer2[0],
        //       Region31: answer3[0] });
        //   });
    },


    populate: async function (req, res) {

        if (!req.params.id) { //user id是否存在
            return res.status(403).json('id error!');
        }
        var coupon = await User.findOne({ id: req.params.id }).populate('CPIN');//用户id查找关联的coupon

        if (!coupon) { return res.notFound(); }

        return res.json({ Coupon: coupon });
    },
    //看用户有没有登录之后生成session，有的话就前端get到这个会话
    getSession: async function (req, res) {
        if (!req.session) {
            return res.json('don\'t exsist');
        } else {
            if (req.wantsJSON) {
                return res.json({ session: req.session }); // for ajax request
            }
        }
    },
    //用户兑换优惠券
    // Redeem: async function (req, res) {

    //     if (!req.query.cid || !req.query.uid) { // 输入验证【user id辨认】
    //         return res.status(403).json('parameter error!');
    //     }

    //     var user = await User.findOne({ id: req.query.uid }).populate('CPIN');
    //     if (!user) {
    //         return res.status(403).json('Member not found.');
    //     }
    //     if (user.role === 'visitor') { // 双=和三=的区别
    //         return res.status(403).json('No authority');
    //     }

    //     var coupon = await Coupon.findOne({ id: req.query.fk });

    //     if (!coupon) {
    //         return res.status(403).json('Coupons not found.');
    //     }

    //     // 每个会员只能兑换优惠券一次
    //     var isRedeem = false;
    //     for (let cp of user.CPIN) { //cp是兑换过的其中一个优惠券
    //         if (cp.id === req.query.fk) {
    //             isRedeem = true;
    //             break;//跳出循环
    //         }
    //     }
    //     if (isRedeem) return res.status(403).json('Had redeemed!');

    //     if (user.coins >= coupon.coins) {
    //         // 优惠券数量是大于1
    //         if (coupon.quota >= 1) {
    //             // 给用户领券  
    //             await User.addToCollection(req.query.id, 'CPIN').members(
    //                 req.query.fk //券的id
    //             );
    //             // 更新用户 剩余的点数
    //             user.coins = user.coins - coupon.coins;
    //             await User.updateOne({ id: user.id }).set(
    //                 { coins: user.coins }
    //             );

    //             // 更新session里用户的点数
    //             req.session.coins = user.coins;

    //             // 更新现金券的剩余数量
    //             coupon.quota = coupon.quota - 1;
    //             await coupon.updateOne({ id: coupon.id }).set({
    //                 quota: coupon.quota,
    //             });

    //         } else {
    //             return res.status(403).json('This coupon\'s quota is zero');
    //         }
    //     } else {
    //         return res.status(403).json('Your balance is not enough.');
    //     }
    //     return res.ok();
    // },

    //用户兑换优惠券
    Redeem: async function (req, res) {

        if (!req.query.cid || !req.session.userId) { // 输入验证【user id辨认】
            return res.status(403).json('parameter error!');
        }

        if (!await User.findOne(req.session.userId)) return res.status(404).json("User not found.");

        var thatCoupon = await Coupon.findOne(req.query.cid).populate("userRedeem", { id: req.session.userId  });

        if (!thatCoupon) return res.status(404).json("Coupon not found.");

        if (thatCoupon.userRedeem.length > 0) {
            return res.status(404).json("Already Redeemed!");
        }
        //两个if
        var user = await User.findOne(req.session.userId );
        // var coupon = await User.findOne(req.session.userId).populate('CPIN');
        if(user.coins >= thatCoupon.coins)
        {
            if (thatCoupon.quota >= 1) {
                // 给用户领券  
                await User.addToCollection(req.session.userId, 'CPIN').members(
                    req.query.cid //券的id
                );
                // 更新用户 剩余的点数
                user.coins = user.coins - thatCoupon.coins;
                await User.updateOne({ id: user.id }).set(
                    { coins: user.coins }
                );

                // 更新session里用户的点数
                req.session.coins = user.coins;

                // 更新现金券的剩余数量
                thatCoupon.quota = thatCoupon.quota - 1;
                await Coupon.updateOne(thatCoupon.id ).set({
                    quota: thatCoupon.quota,
                });

            } else {
                return res.status(408).json('This coupon\'s quota is zero');
            }
        } else {
            return res.status(403).json('Your balance is not enough.');
        }

        // if(coupon,quta)


        // if (thatCoupon.userRedeem.length > 0) 
        // return res.status(409).json("Already added.");   
        // // if (user.coins < thatCoupon.coins )
        // //     return res.status(408).json("Already added1.");
        // // if (user.quota < thatCoupon.quota )
        // //     return res.status(407).json("Already added2.");   

        // await User.addToCollection(req.query.uid, "CPIN").members(req.query.cid);

        return res.ok();

        // var user = await User.findOne({ id: req.query.uid }).populate('CPIN'); 
        // if (!user) {
        //   return res.status(403).json('Member not found.');
        // }
        // if (user.role === 'visitor') { // 双=和三=的区别
        //   return res.status(403).json('No authority');
        // }

        // var coupon = await Coupon.findOne({ id: req.query.fk });

        // if (!coupon) {
        //   return res.status(403).json('Coupons not found.');
        // }

        // // 每个会员只能兑换优惠券一次
        // var isRedeem = false;
        // for (let cp of user.CPIN) { //cp是兑换过的其中一个优惠券
        //   if (cp.id === req.query.fk) {
        //     isRedeem = true;
        //     break;//跳出循环
        //   }
        // }
        // if (isRedeem) return res.status(403).json('Had redeemed!');

        // if(user.coins >= coupon.coins){
        //   // 优惠券数量是大于1
        //   if(coupon.quota >= 1){
        //     // 给用户领券  
        //     await User.addToCollection(req.query.id, 'CPIN').members(
        //       req.query.fk //券的id
        //     );
        //     // 更新用户 剩余的点数
        //     user.coins = user.coins - coupon.coins;
        //     await User.updateOne({id: user.id}).set(
        //       {coins: user.coins}
        //     );

        //     // 更新session里用户的点数
        //     req.session.coins = user.coins;

        //     // 更新现金券的剩余数量
        //     coupon.quota = coupon.quota - 1;
        //     await coupon.updateOne({id: coupon.id}).set({
        //       quota: coupon.quota,
        //     });

        //   } else{
        //     return res.status(403).json('This coupon\'s quota is zero');
        //   }
        // } else{
        //   return res.status(403).json('Your balance is not enough.');
        // }
        // return res.ok();
    },
};
