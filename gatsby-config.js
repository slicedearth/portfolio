/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */
module.exports = {
  /* Your site config here */
  siteMetadata: {
    title: "Abymar",
    description:
      "Personal portfolio website that showcases projects and skills.",
  },
  plugins: [
    `gatsby-plugin-preact`,
    `gatsby-plugin-netlify`,
    `gatsby-plugin-netlify-cache`,
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/data/`,
      },
    },
    `gatsby-transformer-json`,
    `gatsby-plugin-preload-fonts`,
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        printRejected: true,
      },
    },
  ],
}
