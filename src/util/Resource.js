/** GET HAR-CODED COLECTION OF DATA */
import Chats from '@/util/Chats.js'
const OldChats = new Chats();

class Resource {
    constructor() {

        this.weekdays = [
            'Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 
        ];

        this.suggestions = [
            'have evolved', 'variations', 'repeat predefined', 'belief', 'book', 'through', 'the point'
        ];

        this.chats = OldChats.getAll();

    }

    /**CREATE NEW CHAT, PASS THE PARAM chat AS postType*/
    create(postType, data){
        if(postType.toLowerCase() == 'chat'){
            let newChat = {};
            let fullDate = new Date();
            let weekday = fullDate.getDay();
            let date = {
                date: fullDate.toJSON().slice(0,10).replace(/-/g,'/') +' '+this.weekdays[weekday],
                time: fullDate.getHours()+':'+fullDate.getMinutes()
            }

            newChat = {
                id: Math.random().toString(36).substring(7),
                userId: data.userId,
                userName: data.userName,
                text: data.text,
                date
            }

            this.chats.push(newChat);

            return this.get('chats');
        }
    }

    /**THE postType CAN BE EITHER chats OR suggestions */
    get(postType) {
        if(postType.toLowerCase() == 'chats') {
            /** GROUP THE CHATS BY DATE */
            let groupChats = [];
            this.chats.forEach(ele => {
                let date = ele.date.date;
                let tempArray = [];
                this.chats.forEach(nextEle => {
                    if(date == nextEle.date.date){
                        tempArray.push(nextEle);
                    }
                });
                let group = {
                    date: date,
                    chats: tempArray
                }
                groupChats.push(group);
            });
            
            /** REMOVE DUPLICATES */
            let dates = groupChats.map(o => o.date)
            let filtered = groupChats.filter(({date}, index) => !dates.includes(date, index + 1))

            return filtered;
        }
        else if(postType.toLowerCase() == 'suggestions'){
            return this.suggestions;
        }
        else{
            return 'Requested data does not exist';
        }
    }

    delete(id){
        let removeIndex = this.chats.findIndex(x => x.id == id);
        this.chats.splice(removeIndex, 1);

        return this.get('chats');
    }

    removeDuplicates(originalArray, prop) {
        var newArray = [];
        var lookupObject  = {};
   
        for(var i in originalArray) {
           lookupObject[originalArray[i][prop]] = originalArray[i];
        }
   
        for(i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
         return newArray;
    }
}

export { Resource as default };