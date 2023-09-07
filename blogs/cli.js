require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL)

const printBlogs = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
    blogs.map(b => console.log(printPrettyBlog(b)))
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

const printPrettyBlog = (blog) => {
    return `${blog.author}: '${blog.title}', ${blog.likes} likes`
}

module.exports = {
  printBlogs, // Export the printBlogs function
};
