/**
 * 解析歌词，将歌词转换为合适的数据结构
 * @param String
 * @returns
 * */
const parseLyrics = (str) => {
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
const parseTime = (time) => {
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
/**
 * 匹配当前时间位于第几行
 * @param
 * @returns
 **/
const findIndex = () => {
  console.log(doms.audio.currentTime)
  let currentTime = doms.audio.currentTime
  for (let i = 0; i < lyrics.length; i++) {
    if (+lyrics[i].time > currentTime) {
      return i - 1
    }
  }
  return -1
}
const lyrics = parseLyrics(lyc)
const containerHeight = doms.container.clientHeight
const liHeight = doms.ul.children[0].clientHeight
const maxOffset = doms.ul.clientHeight - containerHeight
const offsetControls = () => {
  let index = findIndex()
  console.log('-----controls----', index);
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
const setLyrics = () => {
  console.log(lyrics);
  for (let i = 0; i < lyrics.length; i++) {
    let li = document.createElement('li')
    li.textContent = lyrics[i].word
    doms.ul.appendChild(li)
  }
}
const start = () => {
  doms.audio.addEventListener('timeupdate', offsetControls)
}
start()