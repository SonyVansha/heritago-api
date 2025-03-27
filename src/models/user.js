const User = require('./userModel');

const modelUser = {
  getAll: async () => {
      return await User.findAll({ attributes: ['id', 'username'] });
  },

  getById: async (username) => {
      return await User.findOne({ where: { username }, attributes: ['id', 'username'] });
  },

  create: async (data) => {
      try {
          return await User.create(data);
      } catch (error) {
          if (error.name === 'SequelizeUniqueConstraintError') {
              throw new Error("Username sudah digunakan");
          }
          throw error;
      }
  },

  delete: async (id) => {
      if (!id || isNaN(id)) {
          throw new Error(`ID tidak valid: ${id}`);
      }
      const result = await User.destroy({ where: { id: Number(id) } });
      return result > 0;
  }
};


module.exports = modelUser ;
