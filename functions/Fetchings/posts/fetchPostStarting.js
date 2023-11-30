import getPosts from "../../../handlers/posts/getPosts"
import RemoveMillisecondsFromDateStr from "../../Format/removeMilliseconds"

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`;
  }

  AMOUNT_POST = 10;

  export const HandleStarting = async (setPosts, setLatestDate, setIsStarting) =>{
    try {
      setIsStarting(true);
      const fetchedPosts = await getPosts(formatDate(new Date()), AMOUNT_POST);
      if (fetchedPosts.length > 0) {
        setPosts(fetchedPosts);
        setLatestDate(RemoveMillisecondsFromDateStr(fetchedPosts[fetchedPosts.length - 1].posted_at));
      }
    } catch (error) {
      console.error('Error while loading posts:', error);
    } finally {
      setIsStarting(false);
    }
  }