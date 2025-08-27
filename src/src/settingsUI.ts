class ui {
    /**
     * Tạo một div trống
     * @param id Id của 1 div trống
     * @param childs Các phần tử con sẽ được thêm vào div này
     * @param show Điều kiện để hiển thị các phần tử con (False = không hiển thị)
     */
    Row = (id: string, childs: any, show = true) => {
        const row = document.createElement('div')
        row.classList.add('elaina-theme-settings-row')
        row.id = id
        if (Array.isArray(childs) && show) childs.forEach((el) => row.appendChild(el))
        return row
    }

    /**
     * Tạo một label hoặc text 
     * @param text Nội dung của label
     * @param id Id của label
     * @param cls Class của label, mặc định là "Elaina-theme-template-class"
     * @param style Style của label, mặc định là ""
     */
    Label = (text: string, id = "", cls = "Elaina-theme-template-class", style = "") => {
        const label = document.createElement('p')

        label.classList.add('lol-settings-window-size-text')
        label.classList.add('elaina-theme-settings-text')
        label.classList.add(cls)
        label.id = id
        label.style.cssText = style
        label.innerText = text
        
        return label
    }

    /**
     * Tạo 1 thẻ đường dẫn a
     * @param text Text hiển thị của đường dẫn
     * @param href Đường dẫn đến trang đích
     * @param onClick Hàm sẽ gọi khi người dùng click vào đường dẫn
     * @param id Id của thẻ
     */
    Link = (text: string, href: string, onClick: any, id = "") => {
        const link = document.createElement('p')
        link.classList.add('lol-settings-code-of-conduct-link')
        link.classList.add('lol-settings-window-size-text')
    
        const a = document.createElement('a')
        a.innerText = text
        a.target = '_blank'
        a.href = href
        a.onclick = onClick || null
        a.download
        a.id = id
    
        link.append(a)
        return link
    }

    /**
     * Tạo 1 checkbox
     * @param text Nội dung của checkbox
     * @param id Id của parent chứa checkbox
     * @param boxID Id của checkbox
     * @param check Kiểm tra sự thay đổi của checkbox, sẽ gọi hàm này khi người dùng click vào checkbox
     * @param show Có hiển thị checkbox hay không
     * @param Datastore Tên của Datastore, kiểu string
     */
    CheckBox = (text: string, id: string, boxID: string, check: any, show: boolean, Datastore: string) => {
        const container = document.createElement("div")
        container.style.width = "fit-content"

        const origin = document.createElement("lol-uikit-flat-checkbox")
        origin.id = id
        origin.setAttribute("lastDatastore", window.DataStore.get(Datastore))

        const label = document.createElement("label")
        label.innerHTML = text
        label.setAttribute("slot", "label")

        const checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.id = boxID
        checkbox.setAttribute("slot", "input")
        if (window.DataStore.get(Datastore)){
            checkbox.checked = true
            origin.setAttribute("class", "checked")
        }
        else {
            checkbox.checked = false
            origin.setAttribute("class",'')
        }
        checkbox.onclick = () => {
            if (window.DataStore.get(Datastore)) {
                origin.removeAttribute("class")
                checkbox.checked = false
                window.DataStore.set(Datastore, false)
                check()
            }
            else {
                origin.setAttribute("class", "checked")
                checkbox.checked = true
                window.DataStore.set(Datastore, true)
                check()
            }
        }
        
    
        if (show) {
            container.appendChild(origin)
            origin.appendChild(checkbox)
            origin.appendChild(label)
    
            return container
        }
        else {
            const blankDiv = document.createElement("div")
            container.appendChild(blankDiv)
            return container
        }
    }

    /**
     * Tạo một dropdown
     * @param DataList Danh sách dữ liệu để tạo dropdown, sẽ có dạng {Object: [{object: string, object: string,...},...]}
     * @param Datastore tên cua Datastore, kiểu string
     * @param text Nội dung của dropdown
     * @param name Tên của thuộc tính trong mỗi object sẽ hiển thị trong dropdown, lấy trong DataList
     * @param id Id của mỗi option trong dropdown, lấy trong DataList
     * @param dropdownId Id của dropdown
     * @returns 
     */
    Dropdown = (DataList: Object, Datastore: string, text: string, name: string, id: string, dropdownId?: string) => {
        const origin = document.createElement("div")
        origin.classList.add("Dropdown-div")
        origin.id = dropdownId || ""

        const title = this.Label(text, "")

        const dropdown = document.createElement("lol-uikit-framed-dropdown")
        dropdown.classList.add("lol-settings-general-dropdown")

        origin.append(title,dropdown)

        for (let i = 0; i < DataList[Datastore].length; i++) {
            const opt = DataList[Datastore][i]
            const el = document.createElement("lol-uikit-dropdown-option")
            el.setAttribute("slot", "lol-uikit-dropdown-option")
            el.innerText = opt[name]
            el.id = opt[id]
            el.onclick = () => {
                window.DataStore.set(Datastore, opt[id])
            }
            if (window.DataStore.get(Datastore) == opt[id]) {
                el.setAttribute("selected", "true")
            }
            dropdown.appendChild(el)
        }
        return origin
    }
}

const UI = new ui()

export { UI }