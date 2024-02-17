import lyc from 'assets/data.js'

type Lyrics = {
  time: number
  word: string
}
/**
 * 解析歌词，将歌词转换为合适的数据结构
 * @param String
 * @returns
 * */
const parseLyrics = (str: String): Array<Lyrics> => {
  const timeWordArray = str.split('\n')
  console.log(timeWordArray)
  const lyricsArray = new Array(timeWordArray.length)
  for (let i = 0; i < timeWordArray.length; i++) {
    const tempLyrics = timeWordArray[i].split(']')
    const tempLyricsItem = {
      time: parseTime(tempLyrics[0].substring(1)),
      word: tempLyrics[1],
    }
    lyricsArray[i] = tempLyricsItem
  }
  console.log(lyricsArray)

  return lyricsArray
}
/**
 * 转换时间，把分秒转换成秒
 * @param
 * @returns
 **/
const parseTime = (time: String) => {
  let timeArray = time.split(':')
  //这里有一个精度问题需要注意
  let realTime = +timeArray[0] * 60 + +timeArray[1]
  return realTime
}
const doms = {
  audio: document.querySelector('audio'),
  container: document.querySelector('.container'),
  ul: document.querySelector('ul'),
}
const lyrics = parseLyrics(lyc)
const setLyrics = () => {
  let frag = document.createDocumentFragment()
  for (let i = 0; i < lyrics.length; i++) {
    let li = document.createElement('li')
    li.textContent = lyrics[i].word
    li.setAttribute('index', String(i))
    frag.appendChild(li)
  }
  doms.ul.appendChild(frag)
}
setLyrics()

/**
 * 匹配当前时间位于第几行
 * @param
 * @returns
 **/
const findIndex = () => {
  let currentTime = doms.audio.currentTime
  console.log(currentTime)

  for (let i = 0; i < lyrics.length; i++) {
    if (+lyrics[i].time > currentTime) {
      return i - 1
    } else if (i == lyrics.length - 1) {
      return i
    }
  }
  return -1
}
/**
 * 点击歌词跳转到响应歌曲进度
 * @param
 * @returns
 **/
const changeMusic = () => {
  //事件冒泡和事件捕获
  //给父盒子绑定点击事件，e.target可以获取到子盒子
  doms.ul.addEventListener('click', (e) => {
    let target = e.target as HTMLElement
    let index = e.target.getAttribute('index')
    let time = findLyrics(index)
    changeAudio(time)
  })
}
/**
 * 查询歌词所在音乐时间点
 * @param number
 * @returns
 **/
const findLyrics = (index: number) => {
  let idx = index
  let time = lyrics[idx].time
  console.log(lyrics[idx])
  return time
}
/**
 * 更改播放器
 * @param number
 * @returns
 **/
const changeAudio = (time: number) => {
  doms.audio.currentTime = time
  doms.audio.play()
}
changeMusic()
const containerHeight = doms.container.clientHeight
const liHeight = doms.ul.children[0].clientHeight
const maxOffset = doms.ul.clientHeight - containerHeight
const offsetControls = () => {
  let index = findIndex()
  let offset = liHeight * index + liHeight / 2 - containerHeight / 2
  if (offset < 0) {
    offset = 0
  }
  if (offset > maxOffset) {
    offset = maxOffset
  }
  doms.ul.style.transform = `translateY(-${offset}px)`
  let li = document.querySelector('.active')
  if (li) {
    li.classList.remove('active')
  }
  li = doms.ul.children[index]
  if (li) {
    li.classList.add('active')
  }
}

const start = () => {
  doms.audio.addEventListener('timeupdate', offsetControls)
}

start()
