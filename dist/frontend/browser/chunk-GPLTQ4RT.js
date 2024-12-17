import{a as N,b as x,c as O,d as A,e as E,f as H,g as q,h as G,i as L,j as P,k as U}from"./chunk-IZ2RRJJK.js";import"./chunk-4TDNJBFX.js";import{a as R}from"./chunk-C2EWWCXY.js";import{b as Y,d,f as B,g as w,j as V,k,l as F,p as I,q as T}from"./chunk-RGHW7JZX.js";import{d as C}from"./chunk-OEPH3VZB.js";import{Ab as h,Bb as p,Ga as r,Ib as _,Sa as v,Xb as S,Y as s,cb as i,ea as u,fa as m,jb as n,kb as l,lb as c,mb as y,pb as g,ra as b}from"./chunk-PEAAODBY.js";import"./chunk-4CLCTAJ7.js";var j=class M{budget_id=b("");#e=s(R);#t=s(C);form=s(I).nonNullable.group({title:["",d.required],category:["",d.required],date:["",d.required],amount:["0",[d.required]]});constructor(){S(()=>{this.budget_id&&this.getBudgetById(this.budget_id())})}getBudgetById(o){this.#e.getBudgetById(o).subscribe(e=>{e.success&&this.populateForm(e.data)})}populateForm(o){let e=new Date(o.date),t=new Date(Date.UTC(e.getUTCFullYear(),e.getUTCMonth(),2));this.form.setValue({title:o.title,category:o.category,date:t.toISOString(),amount:o.amount.toString()})}chosenYearHandler(o){let e=this.form.controls.date.value?new Date(this.form.controls.date.value):new Date;e.setFullYear(o.getFullYear()),this.form.controls.date.setValue(e.toISOString())}chosenMonthHandler(o,e){let t=this.form.controls.date.value?new Date(this.form.controls.date.value):new Date;t.setMonth(o.getMonth()),t.setDate(1),t.setHours(0,0,0,0),this.form.controls.date.setValue(t.toISOString()),e.close()}save(){let o={title:this.form.controls.title.value,category:this.form.controls.category.value,date:this.setToFirstDayOfMonth(this.form.controls.date.value),amount:Number(this.form.controls.amount.value),budget_id:this.budget_id()};this.#e.updateBudget(this.budget_id(),o).subscribe(e=>{e.success&&(alert("Budget updated successfully"),this.#t.navigate(["/budget"]))})}setToFirstDayOfMonth(o){let e=this.form.controls.date.value?new Date(this.form.controls.date.value):new Date;return e.setMonth(e.getMonth()),e.setDate(1),e.setHours(0,0,0,0),new Date(e)}static \u0275fac=function(e){return new(e||M)};static \u0275cmp=v({type:M,selectors:[["app-budgetedit"]],inputs:{budget_id:[1,"budget_id"]},features:[_([{provide:N,useValue:{parse:{dateInput:"MM/YYYY"},display:{dateInput:"MM/YYYY",monthYearLabel:"MM YYYY",dateA11yLabel:"MM/YYYY",monthYearA11yLabel:"MMMM YYYY"}}}])],decls:15,vars:8,consts:[["picker",""],[1,"budget-form",3,"ngSubmit","formGroup"],["placeholder","title",3,"formControl"],["placeholder","category",3,"formControl"],["matInput","","placeholder","Choose a date",3,"matDatepicker","formControl"],["matSuffix","",3,"for"],["startView","multi-year","panelClass","month-picker",3,"yearSelected","monthSelected"],["placeholder","amount",3,"formControl"],[3,"disabled"]],template:function(e,t){if(e&1){let a=y();n(0,"h1"),p(1,"Edit Budget"),l(),n(2,"form",1),g("ngSubmit",function(){return u(a),m(t.save())}),c(3,"input",2)(4,"input",3),n(5,"mat-form-field")(6,"mat-label"),p(7,"Date"),l(),c(8,"input",4)(9,"mat-datepicker-toggle",5),n(10,"mat-datepicker",6,0),g("yearSelected",function(f){return u(a),m(t.chosenYearHandler(f))})("monthSelected",function(f){u(a);let z=h(11);return m(t.chosenMonthHandler(f,z))}),l()(),c(12,"input",7),n(13,"button",8),p(14,"Update"),l()()}if(e&2){let a=h(11);r(2),i("formGroup",t.form),r(),i("formControl",t.form.controls.title),r(),i("formControl",t.form.controls.category),r(4),i("matDatepicker",a)("formControl",t.form.controls.date),r(),i("for",a),r(3),i("formControl",t.form.controls.amount),r(),i("disabled",t.form.invalid)}},dependencies:[T,V,Y,B,w,k,F,U,G,L,P,x,q,H,E,O,A],styles:[".budget-form[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:16px;max-width:500px;margin:auto;padding:20px;box-shadow:0 2px 4px #0000001a;border-radius:8px;background:#fff}"]})};export{j as BudgeteditComponent};
