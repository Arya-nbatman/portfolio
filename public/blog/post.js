function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const id = new URLSearchParams(window.location.search).get("id");

if (!id) {
  document.body.innerHTML = "<h1>Post not found</h1>";
  throw new Error("Missing post ID");
}

fetch(`/api/blog?id=${id}`)
  .then(res => {
    if (!res.ok) throw new Error("Post not found");
    return res.json();
  })
  .then(post => {
    document.getElementById("title").textContent = post.title;
    document.getElementById("category").textContent = post.categories;
    document.getElementById("date").textContent = formatDate(post.updated_at);
    document.getElementById("content").innerHTML = post.html;
  })
  .catch(() => {
    document.body.innerHTML = "<h1>Post not found</h1>";
  });
