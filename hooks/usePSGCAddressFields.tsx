import { useState } from 'react'

import { ComboboxItem } from '@/lib/types'

export default function usePSGCAddressFields() {
  const [provinces, setProvinces] = useState<ComboboxItem[]>([])
  function getProvinces() {
    fetch('https://psgc.gitlab.io/api/provinces')
      .then((response) => response.json())
      .then((response) => {
        setProvinces([
          {
            value: "0|Metro Manila",
            label: "Metro Manila",
          },
          ...response.map((item: { name: string; code: string }) => ({
            value: `${item.code}|${item.name}`,
            label: item.name,
          })),
        ])
      })
  }

  const [cityMunicipalities, setCityMunicipalities] = useState<ComboboxItem[]>(
    [],
  )
  function getNCRCityMunicipalities() {
    fetch(' https://psgc.gitlab.io/api/regions/130000000/cities-municipalities/')
      .then((response) => response.json())
      .then((response) => {
        setCityMunicipalities(
          response.map((item: { name: string; code: string }) => ({
            value: `${item.code}|${item.name}`,
            label: item.name,
          })),
        )
      })
  }
  function getCityMunicipalities(province?: string) {
    if (!province) return
    province = province.split('|')[0]

    if (province === "0") return getNCRCityMunicipalities()

    fetch(
      `https://psgc.gitlab.io/api/provinces/${province}/cities-municipalities`,
    )
      .then((response) => response.json())
      .then((response) => {
        setCityMunicipalities(
          response.map((item: { name: string; code: string }) => ({
            value: `${item.code}|${item.name}`,
            label: item.name,
          })),
        )
        if (barangays.length) setBarangays([])
      })
  }

  const [barangays, setBarangays] = useState<ComboboxItem[]>([])
  function getBarangays(cityMuni?: string) {
    if (!cityMuni) return
    cityMuni = cityMuni.split('|')[0]

    fetch(
      `https://psgc.gitlab.io/api/cities-municipalities/${cityMuni}/barangays`,
    )
      .then((response) => response.json())
      .then((response) => {
        setBarangays(
          response.map((item: { name: string; code: string }) => ({
            value: `${item.code}|${item.name}`,
            label: item.name,
          })),
        )
      })
  }

  return {
    provinces,
    cityMunicipalities,
    barangays,
    getProvinces,
    getCityMunicipalities,
    getBarangays,
  }
}
