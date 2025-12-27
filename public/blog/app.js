function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

const container = document.getElementById("posts");
if (container) {
  fetch("/api/blog")
    .then((res) => res.json())
    .then((blogs) => {
      console.log("BLOGS FROM API:", blogs);
      blogs.forEach((blog) => {
        const card = document.createElement("article");
        card.className = "post-card";

        card.innerHTML = `
                <article class="post-card">
                <span class="tag html">${blog.categories}</span>
                <h2>${blog.title}</h2>
                <time>${formatDate(blog.updated_at)}</time>
                </article>
              `;
        card.addEventListener("click", () => {
          window.location.href = `/blog/post.html?id=${blog.id}`;
        });

        container.appendChild(card);
      });
    })
    .catch((err) => console.error(err));
}
