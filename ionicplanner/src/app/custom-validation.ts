import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export function isDateRangeValid(fc: AbstractControl)  
{
    //console.log('isDateRangeValid() called...');
    let from: string = 'date_of_start';
    let to: string = 'date_of_end';

    //console.log('fc.value = ', fc.value);
    const curr = new Date();
    const firstday = new Date(new Date().setDate(curr.getDate() - curr.getDay()));
    const lastday = new Date(new Date().setDate(curr.getDate() - curr.getDay()+6));
    const selectedDate = new Date(fc.value);

    // console.log("curr = ", curr, curr.toUTCString(), curr.toLocaleDateString());
    // console.log("firstday = ", firstday, firstday.toUTCString() , firstday.toLocaleDateString());
    // console.log("lastday = ", lastday, lastday.toUTCString(), lastday.toLocaleDateString());
    // console.log("selectedDate = ", selectedDate, selectedDate.toUTCString(), selectedDate.toLocaleDateString());
    // console.log('*************************************');
    // Use date.setUTCHours() instead of date.setHours() because this is GMT/Eastern time -- it might have 1 day difference
    firstday.setUTCHours(0, 0, 0, 0);
    lastday.setUTCHours(11, 59, 0, 0);
    
    if(!(selectedDate >= firstday && selectedDate <= lastday)){
        //console.log(selectedDate.toUTCString() + 'date range is invalid between '+firstday.toUTCString()+" and "+lastday.toUTCString());
        return {
            dateRangeValidity: {value: fc.value}   // validation failed. 
        }
    }else {
        console.log('date range is valid!');
        return null;    // validation passed.
    }
  }


  export function dateLessThan(from: string, to: string) {
    //console.log('dateLessThan() called...');

    return (group: FormGroup): {[key: string]: any} => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        // console.log("Date from should be less than Date to");
        return {
          todatelessthanfrom: "Date from should be less than Date to"
        };
      }
      return {};
    }
  }