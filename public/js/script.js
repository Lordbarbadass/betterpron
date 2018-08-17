let app = new Vue({
  el: "#container",
  data: {
    url: "",
    images: [],
    urlRegExp: /https:\/\/e-hentai.org\/g\/(?:.+?)\/(?:.+?)\//,
    isLoading: false,
    page: 0
  },
  methods: {
    async getGallery() {
      this.isLoading = true;
      this.page = 0;
      this.images = [];
      history.pushState(null, "", `./?q=${encodeURI(this.url)}`)
      // let res = await fetch(`/gallery?url=${encodeURI(this.url)}`, { headers: { "Content-Type": "application/json" } });
      let amountLoaded = 0;
      let xhr = makeRequest(
        `${location.origin}/gallery?url=${encodeURI(this.url)}`, 
        e => {
          this.images.push(e.target.response.slice(amountLoaded));
          amountLoaded = e.loaded;
        }, e => {
          this.isLoading = false;
        });
    },
    movePage (delta) {
      this.page += delta;
      if (this.page < 0) this.page = 0;
      else if (this.page > this.images.length / 50) this.page = Math.floor(this.images.length / 50)
      window.scrollTo(0,0);
    }
  },
  computed: {
    isUrlValid() {
      return this.url && this.urlRegExp.test(this.url);
    },
    curPage() {
      return this.images ? this.images.slice(this.page * 50, this.page * 50 + 50) : [];
    }
  },
  watch: {
    url (val, oldval) {
      if (!this.isUrlValid) return;
      else this.getGallery();
    }
  },
  mounted() {
    this.url = document.querySelector("#url").textContent;
  }
})

function makeRequest(url, onprogress, onload) {
  let xhr = new XMLHttpRequest();
  xhr.addEventListener("progress", onprogress);
  xhr.addEventListener("load", onload);
  xhr.addEventListener("error", console.error);
  xhr.addEventListener("abort", console.error);
  xhr.open("GET", url);
  xhr.send()
  return xhr;
}