 function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        });
      }

      const container = document.getElementById("posts");
      if (container) {
        fetch("http://localhost:3000/blogs")
          .then((res) => res.json())
          .then((blogs) => {
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

              container.appendChild(card);
            });
          })
          .catch((err) => console.error(err));
      }