<?php

namespace Korah\CcRobot\Model\Config\Element;

use Magento\Config\Block\System\Config\Form\Field\FieldArray\AbstractFieldArray;
use Korah\CcRobot\Model\Config\Source\Locale;
use Magento\Framework\Component\ComponentRegistrarInterface;
use Korah\CcRobot\Helper\I18Helper;

class CcrStrings extends AbstractFieldArray
{
    protected $_template = 'Korah_CcRobot::ccrStrings.phtml';
    protected $_labels;
    protected $_locale;
    protected $_helper;
    
    public function __construct(
        Locale $locale,
        I18Helper $i18Helper,
        \Magento\Backend\Block\Template\Context $context, 
        array $data = []
    )
    {
        $this->_helper = $i18Helper;
        $this->_locale = array_filter($locale->toOptionArray(), function($item){
            return $item["value"] != "default";
        });
        parent::__construct($context, $data);
    }

    public function locale()
    {
        return $this->_locale;
    }
    
    public function labels()
    {
        if(!isset($this->_labels))
        {
            $this->_labels = $this->_helper->getLabels();
        }
        return $this->_labels;
    }

    protected function _prepareToRender()
    {
        $this->addColumn('key', ['label' => __('Key'), 'readonly' => 'readonly']);
        $this->addColumn('value', ['label' => __('Value'), 'class' => 'required-entry']);
    }
}