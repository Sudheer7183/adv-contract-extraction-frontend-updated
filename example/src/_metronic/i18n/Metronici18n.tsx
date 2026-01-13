import React, { FC, createContext, useContext } from 'react';
import { WithChildren } from '../helpers'


const I18N_CONFIG_KEY = import.meta.env.VITE_I18N_CONFIG_KEY || 'i18nConfig'


type Props = {
  selectedLang: 'de' | 'en' | 'es' | 'fr' | 'ja' | 'zh',
  selectedColor: 'bg-primary' | 'bg-secondary' | 'bg-success' | 'bg-danger' | 'bg-warning' | 'bg-info' | 'bg-light' | 'bg-dark' | 'bg-white'

}


const initialState: Props = {
  selectedLang: 'en',
  selectedColor: 'bg-primary'
}


function getConfig(): Props {
  const ls = localStorage.getItem(I18N_CONFIG_KEY)
  if (ls) {
    try {
      return JSON.parse(ls) as Props
    } catch (er) {
      console.error(er)
    }
  }
  return initialState
}


function getConfig1(): Props {
  const ls = localStorage.getItem(I18N_CONFIG_KEY)
  if (ls) {
    try {
      return JSON.parse(ls) as Props
    } catch (er) {
      console.error(er)
    }
  }
  return initialState
}
// Side effect
export function setLanguage(lang: string) {
  localStorage.setItem(I18N_CONFIG_KEY, JSON.stringify({ selectedLang: lang }))
  window.location.reload()
}
export function setColor(_mode: string) {
  localStorage.setItem("themeColor", _mode)


  window.location.reload()
}


const I18nContext = createContext<Props>(initialState)


const useLang = () => {
  return useContext(I18nContext).selectedLang
}


const useColor = () => {
  return useContext(I18nContext).selectedColor
}
const MetronicI18nProvider: FC<WithChildren> = ({ children }) => {
  const lang = getConfig()

  return (
    <>
      <I18nContext.Provider value={lang}>{children}</I18nContext.Provider>
    </>
  )

}

export { MetronicI18nProvider, useLang, useColor }
