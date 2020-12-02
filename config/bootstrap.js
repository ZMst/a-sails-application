/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */



module.exports.bootstrap = async function () {

  sails.bcrypt = require('bcryptjs');
  var salt = await sails.bcrypt.genSalt(10);

  //const Coupon = require("../api/models/Coupon");
  // var salt = await Coupon.genSalt(10);

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

  if (await Coupon.count() > 0) {
    return generateUsers();;
  }

  await Coupon.createEach([
    { title: "Greyhound Café giving 20% discount for 10 days!", restaurant: "Greyhound Café", region: "Hong Kong Island", mall: "IFC Mall", image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1603225096573&di=a6fa19ab403c6e420779344ce59e0a91&imgtype=0&src=http%3A%2F%2Fimg1.imgtn.bdimg.com%2Fit%2Fu%3D1024131371%2C1813939416%26fm%3D214%26gp%3D0.jpg", quota: 50, coins: 300, expire: "31/10/2020", detail: "The coupon can use for any time in the day." },
    { title: "10% discount offered by clicking", restaurant: "Mongo Tree", region: "Kowloon", mall: "MegaBox", image: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2636567453,951069137&fm=26&gp=0.jpg", quota: 50, coins: 150, expire: "15/11/2020", detail: "A newly opened restaurant. Giving 10% discount now!" },
    { title: "50% Off Now!", "restaurant": "Yoogane", region: "New Territories", mall: "New Town Plaza", image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1603225096117&di=15edff70441f8f75dd6c4e82df670f42&imgtype=0&src=http%3A%2F%2Fstatic-xiaoguotu.17house.com%2F000%2F209%2F201406202321401743.jpg", quota: 30, coins: 450, expire: "26/10/2020", detail: "Use this coupon to have 50% off on Yoogane's Chiken Galbi" },
    { title: "15% Off BIG COUPON", restaurant: "ANA Gura", region: "Kowloon", mall: "Festival Walk", image: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2581711193,2306308678&fm=26&gp=0.jpg", quota: 10, coins: 650, expire: "30/11/2020", detail: "15% discount for the whole bill." },
    { title: "FREE for once", restaurant: "Delifrance", region: "Hong Kong Island", mall: "Times Square", image: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3249424126,3913868516&fm=26&gp=0.jpg", quota: 1, coins: 3000, expire: "10/11/2020", detail: "Get a free dinner for once!" },
    { title: "The burger only sales for 85% now", restaurant: "The Butchers Club Burger", region: "Kowloon", mall: "APM", image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1603237694980&di=e3ff8f978cea8e580226ce32f4e526e3&imgtype=0&src=http%3A%2F%2Fimg2.imgtn.bdimg.com%2Fit%2Fu%3D1325565207%2C3089264204%26fm%3D214%26gp%3D0.jpg", quota: 50, coins: 150, expire: "29/10/2020", detail: "Use this coupon to have a 15% discount for any burger." },
  ]);
  async function generateUsers() {

    var password = await sails.bcrypt.hash('123456', salt)

    await User.updateOne({ username: 'zmst' }).set({ password });
    await User.updateOne({ username: 'cheeta' }).set({ password });
    await User.updateOne({ username: 'poppy' }).set({ password });
    await User.updateOne({ username: 'happy' }).set({ password });
    await User.updateOne({ username: 'tiger' }).set({ password })

    if (await User.count() > 0) {
      return;
    }
    var hash = await sails.bcrypt.hash('123456', salt);

    await User.createEach([
      { username: 'zmst', password: hash, role: 'admin', coins: 80 },
      { username: 'cheeta', password: hash, role: 'admin', coins: 70 },
      { username: 'poppy', password: hash, role: 'user', coins: 50 },
      { username: 'happy', password: hash, role: 'user', coins: 40 },
      { username: 'tiger', password: hash, role: 'user', coins: 30 },
      // etc.
    ]);
    const zmst = await User.findOne({ username: 'zmst' });
    const cheeta = await User.findOne({ username: 'cheeta' });
    const poppy = await User.findOne({ username: 'poppy' });
    const happy = await User.findOne({ username: 'happy' });
    const tiger = await User.findOne({ username: 'tiger' });

    await async function generateUsers() {

      var password = await sails.bcrypt.hash('123456', salt)

      await User.updateOne({ username: 'zmst' }).set({ password });
      await User.updateOne({ username: 'cheeta' }).set({ password });
      await User.updateOne({ username: 'poppy' }).set({ password });
      await User.updateOne({ username: 'happy' }).set({ password });
      await User.updateOne({ username: 'tiger' }).set({ password })

      if (await User.count() > 0) {
        return;
      }
      var hash = await sails.bcrypt.hash('123456', salt);

      await User.createEach([
        { username: 'zmst', password: hash, role: 'admin', coins: 80 },
        { username: 'cheeta', password: hash, role: 'admin', coins: 70 },
        { username: 'poppy', password: hash, role: 'user', coins: 50 },
        { username: 'happy', password: hash, role: 'user', coins: 40 },
        { username: 'tiger', password: hash, role: 'user', coins: 30 },
        // etc.
      ]);
      const zmst = await User.findOne({ username: 'zmst' });
      const cheeta = await User.findOne({ username: 'cheeta' });
      const poppy = await User.findOne({ username: 'poppy' });
      const happy = await User.findOne({ username: 'happy' });
      const tiger = await User.findOne({ username: 'tiger' });

      const cp1 = await Coupon.findOne({ title: 'Greyhound Café giving 20% discount for 10 days!' });
      const cp2 = await Coupon.findOne({ title: '10% discount offered by clicking' });
      const cp3 = await Coupon.findOne({ title: '50% Off Now!' });
      const cp4 = await Coupon.findOne({ title: '15% Off BIG COUPON' });
      const cp5 = await Coupon.findOne({ title: 'FREE for once' });
      const cp6 = await Coupon.findOne({ title: 'The burger only sales for 85% now' });

      await User.addToCollection(zmst.id, 'CPIN').members(cp1.id);
      await User.addToCollection(cheeta.id, 'CPIN').members(cp2.id, cp3.id);
      await User.addToCollection(poppy.id, 'CPIN').members(cp3.id);
      await User.addToCollection(happy.id, 'CPIN').members(cp4.id, cp5.id);
      await User.addToCollection(tiger.id, 'CPIN').members(cp5.id, cp6.id);
    }


  }
};
