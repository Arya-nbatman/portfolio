function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// 1. Function to fill the HTML with post data
function displayPost(post) {
  document.getElementById("title").textContent = post.title;
  document.getElementById("category").textContent = post.categories;
  document.getElementById("date").textContent = formatDate(post.updated_at);
  document.getElementById("content").innerHTML = post.html;
}

const id = new URLSearchParams(window.location.search).get("id");

if (!id) {
  document.body.innerHTML = "<h1>Post not found</h1>";
  throw new Error("Missing post ID");
}

// 2. Cache logic for specific post ID
const POST_CACHE_KEY = `post_cache_${id}`;
const cachedPost = localStorage.getItem(POST_CACHE_KEY);

if (cachedPost) {
  console.log(`Serving Post ${id} from Cache ⚡`);
  displayPost(JSON.parse(cachedPost));
} else {
  console.log(`Fetching Post ${id} from API 🌐`);
  fetch(`/api/blog?id=${id}`)
    .then(res => {
      if (!res.ok) throw new Error("Post not found");
      return res.json();
    })
    .then(post => {
      // 3. Save specific post to localStorage
      localStorage.setItem(POST_CACHE_KEY, JSON.stringify(post));
      displayPost(post);
    })
    .catch(() => {
      // Fallback if network fails and no cache exists
      document.body.innerHTML = "<h1>Post not found or Offline</h1>";
    });
}