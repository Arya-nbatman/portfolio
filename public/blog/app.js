console.log("Blog Script Initialized"); // This should appear immediately

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

// THIS FUNCTION MUST BE DEFINED BEFORE THE CALL
function renderPosts(blogs, container) {
  console.log("Rendering posts to UI...");
  container.innerHTML = ""; 
  
  blogs.forEach((blog) => {
    const card = document.createElement("article");
    card.className = "post-card";

    card.innerHTML = `
      <span class="tag html">${blog.categories || 'General'}</span>
      <h2>${blog.title}</h2>
      <time>${formatDate(blog.updated_at)}</time>
    `;

    card.addEventListener("click", () => {
      window.location.href = `/blog/post.html?id=${blog.id}`;
    });

    container.appendChild(card);
  });
}

const container = document.getElementById("posts");

if (container) {
  const CACHE_KEY = "aryan_blog_cache";
  const CACHE_TIME_KEY = "aryan_blog_cache_time";
  const ONE_HOUR = 60 * 60 * 1000; 

  const cachedData = localStorage.getItem(CACHE_KEY);
  const cacheTimestamp = localStorage.getItem(CACHE_TIME_KEY);
  
  const isCacheValid = cachedData && cacheTimestamp && (Date.now() - cacheTimestamp < ONE_HOUR);

  if (isCacheValid) {
    console.log("Serving Blog from Cache ⚡");
    // Parse the string back into an object
    const blogs = JSON.parse(cachedData);
    renderPosts(blogs, container);
  } else {
    console.log("Fetching fresh content from API 🌐");
    fetch("/api/blog")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((blogs) => {
        console.log("API Success! Saving to storage.");
        localStorage.setItem(CACHE_KEY, JSON.stringify(blogs));
        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
        
        renderPosts(blogs, container);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        // If API fails, try to show old cache as a last resort
        if (cachedData) {
            console.log("API failed, using expired cache fallback.");
            renderPosts(JSON.parse(cachedData), container);
        }
      });
  }
} else {
    console.error("Error: Could not find the #posts container in HTML.");
}