import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser-animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { SidebarModule } from 'primeng/sidebar';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ChartModule } from 'primeng/chart';
import { DataViewModule } from 'primeng/dataview';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from 'primeng/password';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ChipsModule } from 'primeng/chips';
import { ListboxModule } from 'primeng/listbox';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';
import { CarouselModule } from 'primeng/carousel';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { SplitterModule } from 'primeng/splitter';
import { TimelineModule } from 'primeng/timeline';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { TerminalModule } from 'primeng/terminal';
import { BlockUIModule } from 'primeng/blockui';
import { InplaceModule } from 'primeng/inplace';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { StepsModule } from 'primeng/steps';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MegaMenuModule } from 'primeng/megamenu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SlideMenuModule } from 'primeng/slidemenu';
import { TabMenuModule } from 'primeng/tabmenu';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DockModule } from 'primeng/dock';
import { SpeedDialModule } from 'primeng/speeddial';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { FocusTrapModule } from 'primeng/focustrap';
import { AnimateModule } from 'primeng/animate';

// App Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';

// Services
import { MessageService, ConfirmationService } from 'primeng/api';
import { NotificationService } from './services/notification.service';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    
    // PrimeNG Modules
    ButtonModule,
    CardModule,
    InputTextModule,
    TableModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    RadioButtonModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    TabViewModule,
    AccordionModule,
    PanelModule,
    MenuModule,
    MenubarModule,
    SidebarModule,
    ToolbarModule,
    SplitButtonModule,
    ChartModule,
    DataViewModule,
    PaginatorModule,
    MultiSelectModule,
    SliderModule,
    RatingModule,
    ToggleButtonModule,
    SelectButtonModule,
    InputSwitchModule,
    InputNumberModule,
    InputTextareaModule,
    PasswordModule,
    AutoCompleteModule,
    ChipsModule,
    ListboxModule,
    TreeModule,
    TreeTableModule,
    PickListModule,
    OrderListModule,
    CarouselModule,
    GalleriaModule,
    ImageModule,
    OverlayPanelModule,
    TooltipModule,
    ScrollPanelModule,
    ScrollTopModule,
    SkeletonModule,
    ProgressBarModule,
    TagModule,
    BadgeModule,
    ChipModule,
    DividerModule,
    FieldsetModule,
    SplitterModule,
    TimelineModule,
    VirtualScrollerModule,
    TerminalModule,
    BlockUIModule,
    InplaceModule,
    MessageModule,
    MessagesModule,
    StepsModule,
    TieredMenuModule,
    ContextMenuModule,
    MegaMenuModule,
    PanelMenuModule,
    SlideMenuModule,
    TabMenuModule,
    BreadcrumbModule,
    DockModule,
    SpeedDialModule,
    RippleModule,
    StyleClassModule,
    FocusTrapModule,
    AnimateModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    NotificationService,
    ApiService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
