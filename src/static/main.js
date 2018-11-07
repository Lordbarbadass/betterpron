import "./styles/main.css"
import Vue from "vue/dist/vue.esm.browser"

if (ENV !== "production")
  document.write("<script src=\"http://" + (location.host || "localhost").split(":")[0] +
  ":35729/livereload.js?snipver=1\"></" + "script>")

let app = new Vue({
  el: "#container",
  data: {
    settings: {
      from: null,
      to: null,
      perPage: null,
    },
    url: "",
    urlRegExp: /https:\/\/e-hentai.org\/g\/(?:.+?)\/(?:.+?)\//,
    page: 1,
    nbPages: 1,
    images: [],
    isLoading: false,
  },
  computed: {
    isUrlValid() {
      return this.url && this.urlRegExp.test(this.url)
    },
    curPage() {
      let { images, settings: { perPage }, page } = this
      perPage = perPage ?? 50
      return images.length > perPage ? images.slice((page - 1) * perPage, page * perPage) : images
    },
  },
  methods: {
    async getGallery() {
      if (!this.isUrlValid || this.isLoading) return
      this.isLoading = true
      this.page = 1
      this.images = []
      history.pushState(null, "", `./?q=${encodeURI(this.url)}`)
      let url = `/gallery?url=${encodeURI(this.url)}`
      if (this.settings.from) url += `&from=${this.settings.from}`
      if (this.settings.to) url += `&to=${this.settings.to}`
      let res = await fetch(url, { headers: { "Content-Type": "application/json" } })
      if (res.ok) {
        this.images = await res.json()
      }
      this.isLoading = false
    },
    movePage(delta) {
      this.page += delta
      if (this.page < 1) this.page = 1
      if (this.page > this.nbPages) this.page = this.nbPages
      window.scrollTo(0, 0)
    },
  },
  watch: {
    images(val) {
      this.nbPages = Math.ceil(val.length / (this.settings.perPage ?? 50))
    },
    "settings.perPage"(val) {
      this.nbPages = Math.ceil(this.images / (val))
    },
  },
  mounted() {
    let params = new URLSearchParams(location.search)
    this.url = params.get("q")
  },
})

document.body.onkeyup = function (e) {
  if (e.key === "ArrowRight") app.movePage(1)
  else if (e.key === "ArrowLeft") app.movePage(-1)
}

console.log(app)
