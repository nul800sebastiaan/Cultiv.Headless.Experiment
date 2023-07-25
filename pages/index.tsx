import Container from '../components/container'
import MoreStories from '../components/more-stories'
import HeroPost from '../components/hero-post'
import Intro from '../components/intro'
import Layout from '../components/layout'
import { getAllPosts } from '../lib/api'
import Head from 'next/head'
import { CMS_NAME } from '../lib/constants'
import Post from '../interfaces/post'
import { fetchItem, fetchItems } from '../umbraco-cdapi/umbracoContentDeliveryApi';

type Props = { node, allPosts: Post[], blogPages, morePosts, firstPost };

export default function Index({ node, allPosts, blogPages, morePosts, firstPost }: Props) {

  console.log("firstPost", firstPost);
  return (
    <>
      <Layout>
        <Head>
          <title>{`Next.js Blog Example with ${node.Name}`}</title>
        </Head>
        <Container>
          <Intro />
          <p>{`Bio ${node.properties.bio}`}</p>
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        </Container>
      </Layout>
    </>
  )
}

export const getStaticProps = async () => {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
  ])

  const homepage = await fetchItem('');
  const blogPages = await fetchItems({ filter: 'blogPost' });
  const morePosts = [];
  const firstPost = blogPages.items[0];

  for (let index = 0; index < 2; index++) {
    var item = blogPages.items[index];

    var post = {
      title: item.name,
      excerpt: item.properties.bodyText.markup,
      author: {
        name: "Sebastiaan Janssen",
        picture: "https://cultiv.nl/media/zupl5k1l/https___wwwpolywork.jpg"
      },
      date: item.createDate,
      coverImage: `https://cork.nl${item.properties.image[0].url}`,
      ogImage: {
        url: '/assets/blog/hello-world/cover.jpg'
      },
      slug: item.route.path
    };
    morePosts.push(post);
  }


  return {
    props: {
      node: homepage,
      allPosts: allPosts,
      blogPages: blogPages,
      morePosts: morePosts,
      firstPost: firstPost
    },
  }
}
