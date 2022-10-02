import { ElementType, HTMLHopeProps } from '@hope-ui/solid';

interface NewVMOptions {
}

export type NewVMProps<C extends ElementType = "div"> = HTMLHopeProps<C, NewVMOptions>;

export function NewVM(props: NewVMProps) {
  return (
    <>
      <div class="newVM">
        <h1>New VM</h1>
      </div>
    </>
  );
}