import { switchMap, of, from } from "rxjs";
import { ofType } from "redux-observable";
import { filter, map, withLatestFrom, catchError } from "rxjs/operators";
import { fromFetch } from "rxjs/fetch";
export const NewAction = (type, payload, socketData) => {
  const { event, handleEvent }=socketData||{}
  return {
    type,
    payload,
    soecketEvent:
      event && handleEvent ? { [event]: true, handleEvent } : undefined,
  };
};
export function TypeObserVable(
  { action$, store$ },
  type,
  Observable
) {
  return action$.pipe(
    Array.isArray(type) ? ofType(...type) : ofType(type),
    withLatestFrom(store$),
    switchMap(([action, store]) => Observable(action, store))
  );
}
export function TypeWithFilterObserVable(
  { action$, store$ },
  type,
  filterObservable,
  switchMapObservable
) {
  return action$.pipe(
    Array.isArray(type) ? ofType(...type) : ofType(type),
    withLatestFrom(store$),
    filter(([action, store]) => filterObservable(action, store)),
    switchMap(([action, store]) => switchMapObservable(action, store))
  );
}
export function FetchObservable(
  { action, store },
  requset,
  option,
  socketData
) {
  const { event = undefined, eventName = undefined } = socketData || {};
  return fromFetch(requset, option ? option : {}).pipe(
    switchMap((response) => {
      return from(response.json()).pipe(
        map((data) => {
          return NewAction(`${action.type}_SUCCESS`, data, {
            event,
            handleEvent: {
              eventName,
              params: data,
            },
          });
        }),
        catchError((err, caught) => {
          return of(NewAction("FETCH_FAILED"))
        })
      );
    })
  );
}
