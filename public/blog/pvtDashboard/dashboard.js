// Initialize ToastUI Editor
const editor = new toastui.Editor({
  el: document.querySelector("#editor"),
  height: "400px",
  initialEditType: "wysiwyg",
  previewStyle: "vertical",
});

// Save button click handler
document.getElementById("save").addEventListener("click", async () => {
  const title = document.getElementById("title").value.trim();
  const category = document.getElementById("category").value.trim();
  const html = editor.getHTML();

  if (!title || html === "<p><br></p>" || !category) {
    alert("Please fill in the title, category, and content!");
    return;
  }

  try {
    const res = await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, html, category }),
    });

    if (res.ok) {
      alert("Blog saved successfully!");
      // Optional: Redirect back to home
      window.location.href = "/index.html";
    } else {
      const errorData = await res.json();
      alert("Error: " + errorData.error);
    }
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Connection error. Is vercel dev running?");
  }
});