const editor = new toastui.Editor({
      el: document.querySelector("#editor"),
      height: "400px",
      initialEditType: "wysiwyg",
      previewStyle: "vertical",
    });

    // Save button click handler
    document.getElementById("save").addEventListener("click", async () => {
      const title = document.getElementById("title").value;
      const html = editor.getHTML();

      if (!title || !html) {
        alert("Title or content cannot be empty!");
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, html }),
        });

        const data = await res.json();
        console.log("Server response:", data);
        alert("Blog saved successfully!");
      } catch (err) {
        console.error(err);
        alert("Error saving blog.");
      }
    });