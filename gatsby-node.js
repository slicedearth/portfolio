const path = require("path")
const projects = require("./src/data/projects.json")
const IMAGE_PATH = "./src/images/"
exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  projects.forEach(project => {
    const { title, image, image_alt, githubURL, description } = project
    const { name, ext } = path.parse(image)
    const absolutePath = path.resolve(__dirname, IMAGE_PATH, image)
    const data = {
      name,
      ext,
      absolutePath,
      extension: ext.substring(1),
    }
    const imageNode = {
      ...data,
      id: createNodeId(`project-${name}-image`),
      internal: {
        type: "ProjectImage",
        contentDigest: createContentDigest(data),
      },
    }
    actions.createNode(imageNode)
    const node = {
      id: createNodeId(`project-${title}`),
      title,
      image: imageNode,
      image_alt,
      githubURL,
      description,
      internal: {
        type: "Project",
        contentDigest: createContentDigest(project),
      },
    }
    actions.createNode(node)
  })

  //   projects.forEach(project => {
  //     const node = {
  //       name: project.name,
  //       image: project.image,
  //       image_alt: project.image_alt,
  //       githubURL: project.githubURL,
  //       description: project.description,
  //       id: createNodeId(`Project-${project.name}`),
  //       internal: {
  //         type: "Project",
  //         contentDigest: createContentDigest(project),
  //       },
  //     }
  //     actions.createNode(node)
  //   })
}
