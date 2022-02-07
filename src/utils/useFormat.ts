interface OptionMoney {
  format: string
  currency: string
}
export const useFormat = () => {
  const formatDate = (date: string, time = true) : string => {
    if(!date) {
      return ''
    }
    let dateObj
    if (typeof date !== 'object') {
      date = date.replace(/-/g, '/')
      dateObj = new Date(date)
    } else {
      dateObj = date
    }
    let month = String(dateObj.getMonth() + 1)
    const day = String(dateObj.getDate()).padStart(2, '0')
    const year = String(dateObj.getFullYear())
    if (Number(month) < 10) {
      month = `0${month}`
    }
    if (time) {
      let hour = String(dateObj.getHours())
      let min = String(dateObj.getMinutes())
      if (Number(hour) < 10) {
        hour = `0${hour}`
      }
      if (Number(min) < 10) {
        min = `0${min}` 
      }
      return `${year}-${month}-${day} ${hour}:${min}`
    }
    return `${year}-${month}-${day}`
  }
  const formatTime = (time: string) : string => {
    if (!time) {
      return ''
    }
    const dateObj = new Date('2011-04-20T' + time + '.01')
    let hour = String(dateObj.getHours())
    let min = String(dateObj.getMinutes())
    if (Number(hour) < 10) {
      hour = `0${hour}`
    }
    if (Number(min) < 10) {
      min = `0${min}` 
    }
    return `${hour}:${min}`
  }
  const formatImage = (path: string) : string => {
    return import.meta.env.VITE_IMAGES_URL + path
  }
  const formatMoney = (value: any, option: OptionMoney = { format: 'it-IT', currency: 'VND' }) : any => {
    return value ? value.toLocaleString(option.format, { style: 'decimal', currency: option.currency }) : '0'
  }
  return {
    formatImage,
    formatDate,
    formatMoney,
    formatTime
  }
}
